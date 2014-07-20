class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.float :pe_ratio

      t.timestamps
    end
  end
end
