class CreateGuesses < ActiveRecord::Migration
  def change
    create_table :guesses do |t|
      t.belongs_to :user
      t.belongs_to :company
      t.float :pe_guess
      t.boolean :following

      t.timestamps
    end
  end
end
