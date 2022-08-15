from flask import Flask, render_template
# 引入必要的模組

app = Flask(__name__)      # 初始化一個Flask物件作為伺服器
# 定義一個函式，它將響應並返回一個html描述的頁面，這裡我們是：sketch.html

@app.route("/")    # 定義“路由”
def index():
    return render_template("index_text.html")



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5051)