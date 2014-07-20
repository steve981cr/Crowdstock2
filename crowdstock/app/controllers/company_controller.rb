require 'json'

class CompanyController < ActionController::Base
  def index
    # if session[:user_id]
      @company = Company.all
      list = {companies: @company}
      render json: list
    # else
      # redirect_to "/"
    # end
  end
  def show

    # if session[:user_id]
      company = Company.find_by(name: params[:company])
      index = company.id
      uri = URI.parse("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22COF%22%2C%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
      res = Net::HTTP.get_response(uri)
      json_response = JSON.parse(res.body)

      pe = json_response["query"]["results"]["quote"][index-1]["PERatio"]
      guesses = company.guesses
      sum = 0
      guesses.each do |guess|
        p guess.pe_guess
        sum += guess.pe_guess
      end
      mean = sum/guesses.count
      info = {actual: pe, guess: mean}
    # else
      # redirect_to "/"
    # end
    render json: info
  end
end