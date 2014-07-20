# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Company.create([{name: 'Capital One' },{name: 'Yahoo'},{name: 'Apple'},{name: 'Google'},{name: 'Microsoft'}])
User.create([{username: 'steve@gmail.com', password: '123abc' },{username: 'mario@gmail.com', password: '123abc' },{username: 'kim@gmail.com', password: '123abc'},{username: 'sam@gmail.com', password: '123abc' },{username: 'john@gmail.com', password: '123abc'}])

100.times do
  Guess.create(company_id: rand(5)+1, user_id: rand(5)+1, pe_guess: rand(40)+1, following: true)

end
