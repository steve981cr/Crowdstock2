class User < ActiveRecord::Base

  validates :username, presence: true, uniqueness: true
  validates :password, presence: true

  has_many :guesses
  has_many :companies, through: :guesses

  has_secure_password
end
