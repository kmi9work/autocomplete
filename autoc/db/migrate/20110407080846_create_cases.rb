class CreateCases < ActiveRecord::Migration
  def self.up
    create_table :cases do |t|
      t.string :name
      t.timestamps
    end
  end

  def self.down
    drop_table :cases
  end
end
