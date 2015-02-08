Feature: Category
  In order to check markers filter by category
  As authenticated user
  We need to be able select a category and filter the markers.

  @javascript
  Scenario: Show category selected active
    Given I login with user "carlos"
    When I visit "/#/dashboard/1/category/5"
    Then I should see the category active
