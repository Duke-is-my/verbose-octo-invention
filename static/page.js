const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc": {
			title = 'Character Creator';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', 
				id: 'char_creator',
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					bs: "adam",
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
                    nextUrl: "/cc_browser",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			break;
		}

		case "/cc_browser": {
			title = "Character Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_browser",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 30,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					retut: 1,
					goteam_draft_only: 1,
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/videomaker/full":
		case "/videomaker/full/tutorial": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				id: "video_maker",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 1,
					ctc: "go",
					ut: 60,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					lid: 13,
					isLogin: "Y",
					retut: 0,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					themeId: "custom",
					tlang: "en_US",
					presaveId: presave,
					goteam_draft_only: 1,
					isWide: 1,
					collab: 0,
					nextUrl: "../pages/html/list.html",
					noSkipTutorial: 1,
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		case "/player": {
			title = "Video Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				id: "video_player",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					autostart: 1,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		case "/recordWindow": {
			title = "Record Window";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				id: "video_player",
				quality: "medium",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
<body>
	<header>
		<div>
			<div>
				<a href="./"><img src="/html/dukedlogo.png" /></a>
			</div>
			<div>
				<a class="button_small" onclick="document.getElementById('file').click()">UPLOAD A MOVIE</a>
				<div class="char_dropdown button_small">
					<div>CREATE A CHARACTER</div>
					<menu>
						<a href="/cc?themeId=family&bs=adam">Adam</a>
						<a href="/cc?themeId=family&bs=eve">Eve</a>
						<a href="/cc?themeId=family&bs=bob">Bob</a>
						<a href="/cc?themeId=family&bs=rocky">Rocky</a>
						<div></div>
						<!--
						<a href="/cc?themeId=business&bs=default">Business</a>
						<a href="/cc?themeId=business&bs=heavy">Heavy</a>
						<a href="/cc?themeId=business&bs=kid">Kid</a>
						<div></div>
						<a href="/cc?themeId=whiteboard&bs=default">Whiteboard</a>
						<a href="/cc?themeId=whiteboard&bs=kid">Whiteboard (Kid)</a>
						<div></div>
						-->
						<a href="/cc?themeId=anime&bs=guy">Guy (Anime)</a>
						<a href="/cc?themeId=anime&bs=girl">Girl (Anime)</a>
						<div></div>
						<a href="/cc?themeId=ninjaanime&bs=guy">Guy (Ninja Anime)</a>
						<a href="/cc?themeId=ninjaanime&bs=girl">Girl (Ninja Anime)</a>
						<div></div>
						<a href="/cc?themeId=cc2&bs=default">Lil' Peepz</a>
						<div></div>
						<a href="/cc?themeId=chibi&bs=default">Chibi Peepz</a>
						<div></div>
						<a href="/cc?themeId=ninja&bs=default">Chibi Ninjas</a>
					</menu>
				</div>
				<div class="char_dropdown button_small">
					<div>BROWSE CHARACTERS</div>
					<menu>
						<a href="/cc_browser?themeId=family">Comedy World</a>
						<a href="/cc_browser?themeId=anime">Anime</a>
						<a href="/cc_browser?themeId=ninjaanime">Ninja Anime</a>
						<a href="/cc_browser?themeId=cc2">Lil' Peepz</a>
						<a href="/cc_browser?themeId=chibi">Chibi Peepz</a>
						<a href="/cc_browser?themeId=ninja">Chibi Ninjas</a>
						<a href="/cc_browser?themeId=business">Business Friendly</a>
					</menu>
				</div>
				<a href="/videomaker/full" class="button_big">MAKE A VIDEO</a>
			        <a href="javascript:; onclick="document.getElementById('file').click()" class="button_big">CC Upload</a>
	                        <a href="/html/go_empty.html" class="button_big">go empty</a>
	                </div>
			</div
		</div>
		<div class="warning"><strong>I was just notified by Spark that GoAnimate Inc. wanted me to <a
					href="https://media.discordapp.net/attachments/741394845679091792/778077861650759711/unknown.png">cease
					development on Wrapper</a> ... again.</strong><br>This instance of Wrapper will be taken down any
			time before
			2020-11-17 09:00 UTC.<br><a href='https://github.com/GoAnimate-Wrapper/GoAnimate-Wrapper/projects/1'>Link
				to a progress map of the project on GitHub</a>
		 </div>
	</header>
	<table>
		${toObjectString(attrs, params)}
	</table>
	<form enctype='multipart/form-data' action='/upload_movie' method='post'>
		<input id='file' type="file" onchange="this.form.submit()" name='import' accept=".xml" />
	</form>
	<form enctype='multipart/form-data' action='/upload_character' method='post'>
		<input id='file2' type="file" onchange="this.form.submit()" name='import' accept=".xml" />
	</form>
	<style>
		html {
			font-family: 'Sailec', Arial, sans-serif;
			-ms-text-size-adjust: 100%;
			-webkit-text-size-adjust: 100%;
		}

		body {
			margin: 0;
			background-color: #fff;
			color: #474747;
			font-size: 16px;
			font-weight: 400;
			line-height: 1.5;
			position: relative;
		}

		header {
			position: sticky;
			top: 0;
			width: 100%;
		}

		header>:nth-child(1) {
			align-content: center;
			background-color: #1e1e1e;
			display: inline-block;
			padding-bottom: 13px;
			text-align: center;
			color: #fff;
			width: 100%;
		}

		header>:nth-child(1)>:nth-child(1) {
			float: left;
		}

		header>:nth-child(1)>:nth-child(1)>:nth-child(1)>* {
			margin-left: 10px;
			margin-top: 7px;
			height: 30px;
		}

		header>:nth-child(1)>:nth-child(1)>:nth-child(2) {
			color: #666;
			padding-left: 4px;
			font-weight: 700;
		}

		header>:nth-child(1)>:nth-child(2) {
			margin-right: 20px;
			clear: both;
		}

		.button_big,
		.button_small {
			margin-left: 20px;
			margin-top: 7px;
			display: inline-block;
			padding-top: 5px;
			padding-bottom: 3px;
			border-radius: 3px;
			font-size: 14px;
			text-decoration: none;
			color: #fff;
		}

		.button_big {
			background-color: #d85e27;
			width: 160px;
		}

		.button_big:hover {
			text-decoration: underline;
		}

		.button_small:hover {
			color: #d85e27;
		}

		.button_big:hover,
		.button_small:hover {
			cursor: pointer;
		}

		.char_dropdown:hover>:nth-child(1) {
			cursor: context-menu;
			color: #d85e27;
		}

		.char_dropdown>menu {
			position: relative;
			display: none;
			top: 100%;
			left: 0;
			z-index: 1000;
			float: left;
			width: 100%;
			padding: 10px 0;
			margin: 9px 0 0;
			list-style: none;
			font-size: 14px;
			text-align: left;
			background-color: #fff;
			border: 1px solid #ccc;
			border: 1px solid rgba(0, 0, 0, 0.15);
			border-radius: 4px;
			-webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
			-webkit-background-clip: padding-box;
			background-clip: padding-box;
		}

		.char_dropdown:hover>menu {
			display: block;
		}

		.char_dropdown>menu>a {
			display: block;
			padding: 2px 20px;
			clear: both;
			font-weight: normal;
			color: #333;
			text-decoration: none;
		}

		.char_dropdown>menu>a:hover {
			color: #d85e27;
			background-color: #f5f5f5;
		}

		.char_dropdown>menu>div {
			height: 1px;
			margin: 10px 0;
			background-color: #e5e5e5;
		}

		.warning {
			font-size: 14px;
			padding: 10px 0;
			background-color: #fd7;
			text-align: center;
		}

		.warning::before {
			font-family: 'GlyphiconsRegular';
			padding-right: 4px;
			content: '\E079';
			font-size: 12px;
		}

		.warning>a {
			color: #5596e6;
		}

		table {
			width: 100%;
			max-width: 100%;
			margin-bottom: 127px;
			margin-right: auto;
			margin-left: auto;
			margin-top: 70px;
			background-color: transparent;
			border-collapse: collapse;
			border-spacing: 0;
			font-size: 14px;
		}

		@media(min-width: 768px) {
			table {
				width: 750px;
			}

			tr>:nth-child(2)>* {
				width: 350px;
			}
		}

		@media(min-width: 992px) {
			table {
				width: 970px;
			}

			tr>:nth-child(2)>* {
				width: 580px;
			}
		}

		@media (min-width: 1030px) {
			header>:nth-child(1) {
				padding-bottom: 0;
				height: 44px;
			}

			header>:nth-child(1)>:nth-child(2) {
				clear: none;
				float: right;
			}
		}

		@media(min-width: 1200px) {
			table {
				width: 1170px;
			}

			tr>:nth-child(2)>* {
				width: 780px;
			}
		}

		thead {
			font-weight: 200;
		}

		td {
			padding: 8px;
			vertical-align: middle;
			line-height: 1.42857143;
		}

		thead {
			border-bottom: 2px solid #ddd;
			border-top: 1px solid #ddd;
		}

		tbody>tr {
			border-top: 0;
			border-bottom: 1px solid #ddd;
		}

		tbody>tr:hover {
			background-color: #f5f5f5;
		}

		tr>:nth-child(1) {
			width: 64px;
		}

		tr>:nth-child(1)>img {
			height: 36px;
		}

		tr>:nth-child(1) {
			word-break: break-word;
		}

		tr>:nth-child(2) {
			color: #999;
		}

		tr>:nth-child(2)>:nth-child(1) {
			overflow: hidden;
			text-overflow: ellipsis;
		}

		tr>:nth-child(2)>:nth-child(2) {
			font-family: monospace;
		}

		tr>:nth-child(3) {
			width: 200px;
		}

		tr>:nth-child(3)>* {
			font-family: monospace;
			display: inline-block;
			text-align: center;
			font-size: 14px;
		}

		tr>:nth-child(4) {
			font-family: 'GlyphiconsRegular';
			text-decoration: none;
			padding-top: 5px;
			font-size: 14px;
			width: 80px;
		}

		tr>:nth-child(4)>a {
			display: inline-block;
			text-decoration: none;
			padding-right: 10px;
			color: #474747;
		}

		tr>:nth-child(4)>a:hover {
			color: #d85e27;
		}

		tr>:nth-child(4)>:nth-child(1)::before {
			content: '\E174';
		}

		tr>:nth-child(4)>:nth-child(2)::before {
			content: '\E235';
		}

		tr>:nth-child(4)>:nth-child(3)::before {
			content: '\E182';
		}

		tfoot>tr>td {
			text-align: center;
			border: none;
		}

		tfoot>tr>td>a {
			text-decoration: none;
			color: #474747;
			font-size: 14px;
		}

		form {
			display: none;
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 100;
			src: url('/html/Sailec-Thin.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 200;
			src: url('/html/Sailec-Light.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 400;
			src: url('/html/Sailec-Regular.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 500;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		/* font weight 500 and font weight 700 (bold) are the same for better integration support */
		@font-face {
			font-family: 'Sailec';
			font-weight: 700;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		@font-face {
			font-family: 'GlyphiconsRegular';
			src: url('/html/glyphicons-regular.woff') format('woff');
			font-weight: normal;
			font-style: normal;
		}
	</style>
</body>`)
	return true;
};
