
主要執行程式為 app.py 

可以控制 static 中的 .js和 .css檔案，由於使用 Python Flask 所以靜態檔案都必須放置在 static 資料夾中（在使用 html 引用時，須用<link rel="stylesheet" type="text/css" href="{{ url_for('static', filename='css/main.css') }}" /> 或 <script type="text/javascript" src="{{url_for('static', filename='js/main.js')}}"></script> 輸入 ） 
和 template 中的 .html檔案
在 .html檔案中
	index.html        - 主畫面
	generic.html      - 選擇照片和繪圖板畫面
	result.html       - 顯示簡易結果畫面（心理測驗的結果）
	protect.html      - 輸入帳號密碼的畫面
	psychologist.html - 顯示詳細結果畫面（供諮商師參考的結果）
	（字尾為_en的為英文版的網頁）

	elements.html     - 模板提供的其他元素

此外也會啟用 htp.py 和 htp_en.py
	用於連結 Yolov4模型 偵測圖片，並產生結果儲存於 result/result-dc/result-pic 資料夾中
	此外也會同時產生自動標註的 .txt檔案 儲存在 /txt 資料夾中

	Yolov4模型（儲存於/obj(1）的資料夾中）
		obj.name                     － 辨識類別檔
		yolov4-tiny-obj_best.weights － 模型權重檔
		yolov4-tiny-obj.cfg          － 模型參數檔

輔助檔案 filename.txt
	用於儲存輸入的檔案名稱，讓其他網頁可以在 result/result-dc/result-pic 資料夾中找到對應的結果

其他 Procfile 、 requirements.txt 、 runtime.txt 的檔案為上傳至 heroku 需要的檔案
可參考 https://ithelp.ithome.com.tw/articles/10226472 和官網的操作指令 建立帳號並下載 git 和 Heroku CLI
	登入
		heroku login
	建立新網頁
		heroku create （你的網頁名稱）
	主要更新指令
		git add .
		git commit -am "make it better"
		git push heroku master
	選擇要更新的網頁
		heroku git:remote -a （你的網頁名稱）



模板使用來源：

Stellar by HTML5 UP
html5up.net | @ajlkn
Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)


Say hello to Stellar, a slick little one-pager with a super vibrant color palette (which
I guess you can always tone down if it's a little too vibrant for you), a "sticky" in-page
nav bar (powered by my Scrollex plugin), a separate generic page template (just in case
you need one), and an assortment of pre-styled elements.

Demo images* courtesy of Unsplash, a radtastic collection of CC0 (public domain) images
you can use for pretty much whatever.

(* = not included)

AJ
aj@lkn.io | @ajlkn


Credits:

	Demo Images:
		Unsplash (unsplash.com)

	Icons:
		Font Awesome (fontawesome.io)

	Other:
		jQuery (jquery.com)
		Scrollex (github.com/ajlkn/jquery.scrollex)
		Responsive Tools (github.com/ajlkn/responsive-tools)