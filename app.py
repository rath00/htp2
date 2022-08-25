import os
import pathlib
from flask import Flask, url_for, redirect,  render_template, request
import htp,htp_en
import string
import random
import datetime

datetime_dt = datetime.datetime.today()
datetime_str = datetime_dt.strftime("%Y-%m-%d-%H%M%S")
print(datetime_str)  # 2022/04/29 10:46:26

# 取得目前檔案所在的資料夾 
SRC_PATH =  pathlib.Path(__file__).parent.absolute()
UPLOAD_FOLDER = os.path.join(SRC_PATH)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


# 中文版網頁
@app.route("/generic")
def generic():
    return render_template("generic.html")
@app.route("/result")
def result():
    return render_template("result.html")
@app.route("/psychologist")
def psychologist():
    return render_template("psychologist.html")
@app.route("/password")
def protect():
    return render_template("protect.html")
@app.route("/draw")
def draw():
    n=datetime_str
    return render_template("draw.html", name=n)

# 英文版網頁
@app.route("/generic_en")
def generic_en():
    return render_template("generic_en.html")
@app.route("/result_en")
def result_en():
    return render_template("result_en.html")
@app.route("/psychologist_en")
def psychologist_en():
    return render_template("psychologist_en.html")
@app.route("/password_en")
def protect_en():
    return render_template("protect_en.html")
@app.route("/draw_en")
def draw_en():
    n=datetime_str
    return render_template("draw_en.html", name=n)
    
        

# 中文版網頁控制
@app.route('/generic', methods=['POST'])
def upload_file():
    file = request.files['filename']
    if file.filename != '':
        
        # 取得圖片保存並顯示在result資料夾中
        file.save(os.path.join(UPLOAD_FOLDER+'/result-pic/', file.filename))
        htp.detect(UPLOAD_FOLDER+'/result-pic/'+file.filename)
        img_path = UPLOAD_FOLDER+'/result-pic/'+file.filename
        img_stream = htp.return_img(img_path)
        # 取得圖片產生的文字結果顯示在網頁上
        name=file.filename.split(".")[0]
        text_path =UPLOAD_FOLDER+'/result/'+name+'-result.txt'
        f = open(text_path, 'r')
        text_stream = f.read()
        f.close()

        text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
        f = open(text_path, 'r')
        text_stream_dc= f.read()
        f.close()

        #儲存圖片名稱
        filetxt = open(UPLOAD_FOLDER+'/filename.txt','w+')
        filetxt.write(file.filename)
        filetxt.close()
           
        return render_template('result.html', img_stream=img_stream, text=text_stream, text_dc=text_stream_dc)
    return redirect(url_for('result'))


@app.route('/result', methods=['POST'])
def upload_file2():
    filenamet_path =UPLOAD_FOLDER+'/filename.txt'
    f = open(filenamet_path, 'r') 
    fileN= f.read()
    f.close()
    print(fileN)
    
    if fileN != '':
        img_path = UPLOAD_FOLDER+'/result-pic/'+fileN
        img_stream = htp.return_img(img_path)
        # 取得圖片產生的文字結果顯示在網頁上
        name=fileN.split(".")[0]
        text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
        f = open(text_path, 'r')
        text_stream_dc= f.read()
        f.close()

        warn=text_stream_dc.split("/")[0]
        text_stream_dc=text_stream_dc.split("/")[1]

        return render_template('protect.html', img_stream=img_stream, warn=warn, text_dc=text_stream_dc)  
    
    return redirect(url_for('psychologist'))

@app.route('/password', methods=['POST'])
def password():
    name = request.form['name']
    pw = request.form['pw']
    if name =='DOC' and pw =='result':
        filenamet_path =UPLOAD_FOLDER+'/filename.txt'
        f = open(filenamet_path, 'r') 
        fileN= f.read()
        f.close()
        print(fileN)
        if fileN != '':
            img_path = UPLOAD_FOLDER+'/result-pic/'+fileN
            img_stream = htp.return_img(img_path)
            # 取得圖片產生的文字結果顯示在網頁上
            name=fileN.split(".")[0]
            text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
            f = open(text_path, 'r')
            text_stream_dc= f.read()
            f.close()

            warn=text_stream_dc.split("/")[0]
            text_stream_dc=text_stream_dc.split("/")[1]

            #儲存圖片名稱
            filetxt = open(UPLOAD_FOLDER+'/filename.txt','w+')
            filetxt.write('')
            filetxt.close()     
            return render_template('psychologist.html', img_stream=img_stream, warn=warn, text_dc=text_stream_dc)     
    else: 
        text_stream_dc='請找尋專業諮商師，輸入正確帳號密碼以查閱詳細結果'
        return render_template('psychologist.html', text_dc=text_stream_dc)
    return redirect(url_for('psychologist'))







# 英文版網頁控制
@app.route('/generic_en', methods=['POST'])
def upload_file_en():
    file = request.files['filename']
    if file.filename != '':
        
        # 取得圖片保存並顯示在result資料夾中
        file.save(os.path.join(UPLOAD_FOLDER+'/result-pic/', file.filename))
        htp_en.detect(UPLOAD_FOLDER+'/result-pic/'+file.filename)
        img_path = UPLOAD_FOLDER+'/result-pic/'+file.filename
        img_stream = htp.return_img(img_path)
        # 取得圖片產生的文字結果顯示在網頁上
        name=file.filename.split(".")[0]
        text_path =UPLOAD_FOLDER+'/result/'+name+'-result.txt'
        f = open(text_path, 'r')
        text_stream = f.read()
        f.close()

        text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
        f = open(text_path, 'r')
        text_stream_dc= f.read()
        f.close()

        #儲存圖片名稱
        filetxt = open(UPLOAD_FOLDER+'/filename.txt','w+')
        filetxt.write(file.filename)
        filetxt.close()
           
        return render_template('result_en.html', img_stream=img_stream, text=text_stream, text_dc=text_stream_dc)
    
    return redirect(url_for('result_en'))

@app.route('/result_en', methods=['POST'])
def upload_file2_en():
    filenamet_path =UPLOAD_FOLDER+'/filename.txt'
    f = open(filenamet_path, 'r') 
    fileN= f.read()
    f.close()
    print(fileN)
    if fileN != '':
        img_path = UPLOAD_FOLDER+'/result-pic/'+fileN
        img_stream = htp.return_img(img_path)
        # 取得圖片產生的文字結果顯示在網頁上
        name=fileN.split(".")[0]
        text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
        f = open(text_path, 'r')
        text_stream_dc= f.read()
        f.close()


        warn=text_stream_dc.split("/")[0]
        text_stream_dc=text_stream_dc.split("/")[1]

        return render_template('protect_en.html', img_stream=img_stream, warn=warn, text_dc=text_stream_dc)      
    return redirect(url_for('psychologist_en'))

@app.route('/password_en', methods=['POST'])
def password_en():
    name = request.form['name']
    pw = request.form['pw']
    if name =='DOC' and pw =='result':
        filenamet_path =UPLOAD_FOLDER+'/filename.txt'
        f = open(filenamet_path, 'r') 
        fileN= f.read()
        f.close()
        print(fileN)
        if fileN != '':
            img_path = UPLOAD_FOLDER+'/result-pic/'+fileN
            img_stream = htp.return_img(img_path)
            # 取得圖片產生的文字結果顯示在網頁上
            name=fileN.split(".")[0]
            text_path =UPLOAD_FOLDER+'/result-dc/'+name+'-result-dc.txt'
            f = open(text_path, 'r')
            text_stream_dc= f.read()
            f.close()

            warn=text_stream_dc.split("/")[0]
            text_stream_dc=text_stream_dc.split("/")[1]

            #儲存圖片名稱
            filetxt = open(UPLOAD_FOLDER+'/filename.txt','w+')
            filetxt.write('')
            filetxt.close()     
            return render_template('psychologist_en.html', img_stream=img_stream, warn=warn, text_dc=text_stream_dc)     
    else: 
        text_stream_dc='Please find a professional counselor. Enter the correct account password to view detailed results.'
        return render_template('psychologist_en.html', text_dc=text_stream_dc)
    return redirect(url_for('psychologist_en'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5050)