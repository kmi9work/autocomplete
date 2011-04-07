class MainController < ApplicationController
  def choose
    @results = Cases.all
    respond_to do |format| 
      format.js
    end
  end
  
  def show_man
    sleep(1)
    @case = Cases.find(params[:id])
    
  end
  
  def index
  end
  
  
end
