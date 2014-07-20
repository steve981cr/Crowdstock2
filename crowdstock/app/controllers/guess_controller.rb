class GuessController < ActionController::Base
  def new
    if session[:user_id]
    @company_id = params[:company_id]
    else
      redirect_to "/"
    end
  end
  def create
    Guess.create(company_id: params[:company_id], pe_guess: params[:q])
    redirect_to "/company"
  end
end