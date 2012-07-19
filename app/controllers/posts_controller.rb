# -*- encoding: UTF-8 -*-

class PostsController < ApplicationController
  helper :all

  def create
    a = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a
    id = (
          Array.new(16) do
            a[rand(a.size)]
          end
          ).join
    TwitterLogic.tweet '3D view link: ' + url_for(controller: 'posts', action: 'show', id: id, only_path: false), session['access_token'], session['access_token_secret']
    flash[:notice] = '3Dビューを作成してtweetしました'
    redirect_to action: 'show', id: id
  end

  def show
  end
end
