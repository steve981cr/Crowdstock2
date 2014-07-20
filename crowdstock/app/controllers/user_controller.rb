class UserController < ActionController::Base
  def new

  end
  def create
    @user=User.new(username: params[:username], password: params[:password])
    if @user.save
      session[:user_id]=@user.id
      redirect_to '/company'
    else
      redirect_to '/'
    end
  end

  def sign_in
    user=User.find_by(username: params[:username]).try(:authenticate, params[:password])
    if user
      session[:user_id]=user.id
      redirect_to '/company'
    else
      redirect_to '/'
    end

  end
end