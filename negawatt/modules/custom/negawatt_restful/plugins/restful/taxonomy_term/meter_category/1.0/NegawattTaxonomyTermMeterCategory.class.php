<?php

/**
 * @file
 * Contains \NegawattTaxonomyTermMeterCategory.
 */

class NegawattTaxonomyTermMeterCategory extends \RestfulEntityBaseTaxonomyTerm {

  /**
   * {@inheritdoc}
   */
  public function publicFieldsInfo() {
    $public_fields = parent::publicFieldsInfo();

    $public_fields['parent'] = array(
      'property' => 'parent',
      'resource' => array(
        'meter_category' => array(
          'name' => 'meter_categories',
          'full_view' => FALSE,
        ),
      )
    );

    return $public_fields;

  }

  /**
   *  Overrides \RestfulEntityBase::getList().
   */
  public function getList() {
    $list = parent::getList();

    $return = array();

    // Select vocabulary related.
    $vocabulary = taxonomy_vocabulary_machine_name_load($this->bundle);

    // Order according the taxonomy order.
    $tree = taxonomy_get_tree($vocabulary->vid);
    foreach ($tree as $term) {
      foreach ($list as $item) {
        if ($item['id'] == $term->tid) {
          // Add extra properties.
          $item['depth'] = $term->depth;
          $return[] = $item;
          break;
        }
      }
    }

    return $return;
  }
}
