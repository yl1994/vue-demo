class UsersController < ApplicationController
  def index
    return render :index  unless /json/ =~ request.headers["Accept"]
    params[:page] ||= 1
    params[:per_page] ||= 10
    keyword = params[:keyword]
     query ||= {}
     query[:name_cont] = keyword if keyword.present?
     result = User.ransack(query).result
     @users = result.page(params[:page]).per(params[:per_page])
     render json:   {current_page: params[:page], total: result.count ,data: @users }
  end

  def create
    user = User.create(user_params)
    if user
       render json: {code: 200, msg: "用户创建成功！"}     
    else
			render json: {code: 500, msg: "用户创建失败！"}     
		end 
  end

  def update
    user = User.find(params[:id])
    if user.update(user_params)  
      render json: {code: 200, msg: "用户更新成功！"}   
    else
      render json: {code: 500, msg: "用户更新失败！"}
    end
  end

  def batch
    if User.where(id: params[:ids]).delete_all
      render json: {code: 200, msg: "用户删除成功！"}     
    else
      render json: {code: 200, msg: "用户删除失败！"}    
    end
  end

  def user_params
    params.permit(:name, :age, :address)
  end
end
