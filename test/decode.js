var should = require('should');
var Kyujitai = require('../');

describe('encode', function () {
	it('should correctly convert simple char-to-char kyujitai decoding tasks', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.decode('舊字體').should.equal('旧字体');
			kyujitai.decode('第二次世界大戰').should.equal('第二次世界大戦');
			kyujitai.decode('絕緣狀').should.equal('絶縁状');
			kyujitai.decode('帝國華擊團').should.equal('帝国華撃団');
			done();
		});
	});

	it('should ignore hiragana and katakana when no options supplied', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.decode('艦隊これくしょん').should.equal('艦隊これくしょん');
			kyujitai.decode('ソ連對日宣戰布吿').should.equal('ソ連対日宣戦布告');
			kyujitai.decode('我、夜戰に突入す！').should.equal('我、夜戦に突入す！');
			kyujitai.decode('ガールズ&パンツァー').should.equal('ガールズ&パンツァー');
			kyujitai.decode('STRIKE WITCHES Operation Victory Arrow').should.equal('STRIKE WITCHES Operation Victory Arrow');
			kyujitai.decode('Верный является Каваий').should.equal('Верный является Каваий');
			done();
		});
	});

	it('should correctly convert jukugo kyujitai decoding tasks', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.decode('聯合國軍最高司令官總司令部').should.equal('連合国軍最高司令官総司令部');
			kyujitai.decode('米國在勤帝國大使館海軍事務輔佐官').should.equal('米国在勤帝国大使館海軍事務補佐官');
			kyujitai.decode('日本戰歿學生記念會').should.equal('日本戦没学生記念会');
			done();
		});
	});

	it('should correctly merge different kanji into the same shinjitai according to contexts', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.decode('辯論大會').should.equal('弁論大会');
			kyujitai.decode('辨償金額').should.equal('弁償金額');
			kyujitai.decode('瓣膜症患者').should.equal('弁膜症患者');
			kyujitai.decode('辮髮令').should.equal('弁髪令');
			kyujitai.decode('合辦會社').should.equal('合弁会社');
			kyujitai.decode('弁髦').should.equal('弁髦');
			done();
		});
	});
});
