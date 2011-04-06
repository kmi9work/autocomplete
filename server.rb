#Примерное содержание сервера.
#1) Для первого случая, все данные хранятся в HTML, так что никакой серверной обработки не идёт.

#<2>

if params["q"]
  if params["q"].strip == "$"
    render :text => ManModel.find(:all).map{|i| i.name}.join("\n")
  else
    render :text => ManModel.find_by_sql(["name LIKE ?%", params["q"]]).map{|i| i.name}.join("\n")
  end
elsif params["man"]
  render :text => ManModel.find_by_name(:first, params["man"]).img_and_text
elsif params["classifier"]
  if params["type"] == "0"
    if params["classifier"] == "$"
      ClasModel.find(:all)
    end
    ClasModel.find_by_sql()
  elsif params["type"] == "1"
    
  elsif params["type"] == "2"
    
  end
end

#</2>

#<3>



#</3>