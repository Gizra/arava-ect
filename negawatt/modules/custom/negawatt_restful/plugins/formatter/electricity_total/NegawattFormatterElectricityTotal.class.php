<?php
/**
 * @file
 * Contains NegawattFormatterElectricityTotal.
 */
class NegawattFormatterElectricityTotal extends \RestfulFormatterJson {
  /**
   * {@inheritdoc}
   *
   * Add 'total' section to electricity output.
   */
  public function prepare(array $data) {
    // If we're returning an error then set the content type to
    // 'application/problem+json; charset=utf-8'.
    if (!empty($data['status']) && floor($data['status'] / 100) != 2) {
      $this->contentType = 'application/problem+json; charset=utf-8';
      return $data;
    }

    // Let parent formatter prepare the output.
    $output = parent::prepare($data);

    // Prepare a sum query.
    $request = $this->handler->getRequest();
    $filter = !empty($request['filter']) ? $request['filter'] : array();
    $account = !empty($filter['meter_account']) ? $filter['meter_account'] : null;

    if ($request['q'] != 'api/electricity') {
      return $output;
    }

    $query = db_select('negawatt_electricity_normalized', 'e');

    // Handle 'account' filter (if exists)
    if (!empty($filter['meter_account'])) {
      // Add condition - the OG membership of the meter-node is equal to the
      // account id in the request.
      $query->join('node', 'n', 'n.nid = e.meter_nid');
      $query->join('og_membership', 'og', 'og.etid = n.nid');
      $query->condition('og.entity_type', 'node');
      $query->condition('og.gid', $filter['meter_account']);
      unset($filter['meter_account']);
    }

    // Handle 'type' filter
    if (!empty($filter['type'])) {
      $query->condition('e.type', $filter['type']);
      unset($filter['type']);
    }

    // Handle 'timestamp' filter
    // Make sure it's a 'BETWEEN' filter
    if (!empty($filter['timestamp']) && !empty($filter['timestamp']['operator']) && $filter['timestamp']['operator'] == 'BETWEEN') {
      $query->condition('e.timestamp', $filter['timestamp']['value'][0], '>=');
      $query->condition('e.timestamp', $filter['timestamp']['value'][1], '<');
      unset($filter['timestamp']);
    }

    // Handle meter categories.
    // If none given, take 0 (root) as default.
    $parent_category = !empty($filter['meter_category']) ? $filter['meter_category'] : 0;
    // @fixme: will account be always present?
    // Figure out vocab id from group id (the reverse of og_vocab_relation_get().
    $vocabulary_id = db_select('og_vocab_relation', 'ogr')
      ->fields('ogr', array('vid'))
      ->condition('gid', $account)
      ->execute()
      ->fetchField();
    // Get list of child taxonomy terms.
    $taxonomy_array = taxonomy_get_tree($vocabulary_id, $parent_category);
    // Build an mapping array: cat_id => array(all child cat ids);
    $child_cat_mapping = array();
    foreach ($taxonomy_array as $term) {
      if ($term->depth == 0) {
        // Direct child, add new row to child-cat-mapping.
        $child_cat_mapping[$term->tid] = array($term->tid);
      }
      else {
        // Deep level child, add to the proper row.
        foreach ($child_cat_mapping as $key => $map) {
          $parent = $term->parents[0];
          if (in_array($parent, $map)) {
            // Add the parent to the list under key.
            $child_cat_mapping[$key][] = $term->tid;
            break;
          }
        }
      }
    }
    // Extract only tid from the taxonomy terms.
    $child_categories = array_map(function($term) {return $term->tid;}, $taxonomy_array);
    $query->join('field_data_og_vocabulary', 'cat', 'cat.entity_id = e.meter_nid');
    $query->condition('cat.og_vocabulary_target_id', $child_categories, 'IN');
    $query->join('taxonomy_term_data', 'tax', 'tax.tid = cat.og_vocabulary_target_id');
    $query->fields('tax', array('tid', 'name'));
    $query->groupBy('cat.og_vocabulary_target_id');
    unset($filter['meter_category']);

    // Make sure we handled all the filter fields.
    if (!empty($filter)) {
      throw new \Exception('Unknown fields in filter: ' . implode(', ', array_keys($filter)));
    }

    // Add expressions for electricity min and max timestamps.
    $query->addExpression('SUM(e.sum_kwh)', 'sum');

    $result = $query->execute();
    // Sum all child categories' totals into the parent category.
    $total = array();
    foreach ($result as $row) {
      // Look for the parent category, under which to sum the kwhs
      foreach ($child_cat_mapping as $parent => $children_map) {
        if (in_array($row->tid, $children_map)) {
          // Add the parent to the list under key.
          $total[$parent] += $row->sum;
          break;
        }
      }
    }

    // Add total section to output.
    $output['total'] = $total;

    return $output;
  }
}
