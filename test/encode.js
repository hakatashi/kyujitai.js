var should = require('should');
var kyujitai = require('../');

describe('encode', function () {
	it('should correctly convert simple char-to-char kyujitai encoding tasks', function () {
		kyujitai.encode('旧字体').should.equal('舊字體');
		kyujitai.encode('第二次世界大戦').should.equal('第二次世界大戰');
		kyujitai.encode('絶縁状').should.equal('絕緣狀');
		kyujitai.encode('帝国華撃団').should.equal('帝國華擊團');
	});

	it('should correctly convert jukugo kyujitai encoding tasks', function () {
		kyujitai.encode('連合国軍最高司令官総司令部').should.equal('聯合國軍最高司令官總司令部');
		kyujitai.encode('日本戦没学生記念会').should.equal('日本戰歿學生記念會');
	});

	it('should correctly classify same kanji into different kyujitai according to contexts', function () {
		kyujitai.encode('弁論大会').should.equal('辯論大會');
		kyujitai.encode('弁償金額').should.equal('辨償金額');
		kyujitai.encode('弁膜症患者').should.equal('瓣膜症患者');
		kyujitai.encode('弁髪令').should.equal('辮髮令');
		kyujitai.encode('合弁会社').should.equal('合辦會社');
		kyujitai.encode('弁髦').should.equal('弁髦');
	});
});
