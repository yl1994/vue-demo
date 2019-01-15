Rails.application.routes.draw do
  get 'users/index'
  root to: 'lists#index'
  resources :lists
  resources :users do 
    collection do 
      delete :batch
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
