var should = require('should');
var Kyujitai = require('../');

describe('encode', function () {
	it('should correctly convert simple char-to-char kyujitai encoding tasks', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.encode('旧字体').should.equal('舊字體');
			kyujitai.encode('第二次世界大戦').should.equal('第二次世界大戰');
			kyujitai.encode('絶縁状').should.equal('絕緣狀');
			kyujitai.encode('帝国華撃団').should.equal('帝國華擊團');
			done();
		});
	});

	it('should ignore hiragana and katakana when no options supplied', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.encode('艦隊これくしょん').should.equal('艦隊これくしょん');
			kyujitai.encode('ソ連対日宣戦布告').should.equal('ソ連對日宣戰布吿');
			kyujitai.encode('我、夜戦に突入す！').should.equal('我、夜戰に突入す！');
			kyujitai.encode('ガールズ&パンツァー').should.equal('ガールズ&パンツァー');
			kyujitai.encode('STRIKE WITCHES Operation Victory Arrow').should.equal('STRIKE WITCHES Operation Victory Arrow');
			kyujitai.encode('Верный является Каваий').should.equal('Верный является Каваий');
			done();
		});
	});

	it('should correctly convert jukugo kyujitai encoding tasks', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.encode('連合国軍最高司令官総司令部').should.equal('聯合國軍最高司令官總司令部');
			kyujitai.encode('米国在勤帝国大使館海軍事務補佐官').should.equal('米國在勤帝國大使館海軍事務輔佐官');
			kyujitai.encode('日本戦没学生記念会').should.equal('日本戰歿學生記念會');
			done();
		});
	});

	it('should correctly classify same kanji into different kyujitai according to contexts', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.encode('弁論大会').should.equal('辯論大會');
			kyujitai.encode('弁償金額').should.equal('辨償金額');
			kyujitai.encode('弁膜症患者').should.equal('瓣膜症患者');
			kyujitai.encode('弁髪令').should.equal('辮髮令');
			kyujitai.encode('合弁会社').should.equal('合辦會社');
			kyujitai.encode('弁髦').should.equal('弁髦');
			done();
		});
	});

	it('should encode gyokuon-hoso correctly', function (done) {
		new Kyujitai(function (error) {
			if (error) return done(error);
			var kyujitai = this;

			kyujitai.encode('朕深ク世界ノ大勢ト帝国ノ現状トニ鑑ミ非常ノ措置ヲ以テ時局ヲ収拾セムト欲シ茲ニ忠良ナル爾臣民ニ告ク').should.equal('朕深ク世界ノ大勢ト帝國ノ現狀トニ鑑ミ非常ノ措置ヲ以テ時局ヲ收拾セムト欲シ茲ニ忠良ナル爾臣民ニ吿ク');
			kyujitai.encode('朕ハ帝国政府ヲシテ米英支蘇四国ニ対シ其ノ共同宣言ヲ受諾スル旨通告セシメタリ').should.equal('朕ハ帝國政府ヲシテ米英支蘇四國ニ對シ其ノ共同宣言ヲ受諾スル旨通吿セシメタリ');
			kyujitai.encode('抑〻帝国臣民ノ康寧ヲ図リ万邦共栄ノ楽ヲ偕ニスルハ皇祖皇宗ノ遺範ニシテ朕ノ拳々措カサル所').should.equal('抑〻帝國臣民ノ康寧ヲ圖リ萬邦共榮ノ樂ヲ偕ニスルハ皇祖皇宗ノ遺範ニシテ朕ノ拳々措カサル所');
			kyujitai.encode('曩ニ米英二国ニ宣戦セル所以モ亦実ニ帝国ノ自存ト東亜ノ安定トヲ庶幾スルニ出テ').should.equal('曩ニ米英二國ニ宣戰セル所以モ亦實ニ帝國ノ自存ト東亞ノ安定トヲ庶幾スルニ出テ');
			kyujitai.encode('他国ノ主権ヲ排シ領土ヲ侵スカ如キハ固ヨリ朕カ志ニアラス').should.equal('他國ノ主權ヲ排シ領土ヲ侵スカ如キハ固ヨリ朕カ志ニアラス');
			kyujitai.encode('然ルニ交戦已ニ四歳ヲ閲シ朕カ陸海将兵ノ勇戦朕カ百僚有司ノ励精朕カ一億衆庶ノ奉公各〻最善ヲ尽セルニ拘ラス戦局必スシモ好転セス').should.equal('然ルニ交戰已ニ四歲ヲ閱シ朕カ陸海將兵ノ勇戰朕カ百僚有司ノ勵精朕カ一億衆庶ノ奉公各〻最善ヲ盡セルニ拘ラス戰局必スシモ好轉セス');
			kyujitai.encode('世界ノ大勢亦我ニ利アラス加之敵ハ新ニ残虐ナル爆弾ヲ使用シテ頻ニ無辜ヲ殺傷シ惨害ノ及フ所真ニ測ルヘカラサルニ至ル').should.equal('世界ノ大勢亦我ニ利アラス加之敵ハ新ニ殘虐ナル爆彈ヲ使用シテ頻ニ無辜ヲ殺傷シ慘害ノ及フ所眞ニ測ルヘカラサルニ至ル');
			kyujitai.encode('而モ尚交戦ヲ継続セムカ終ニ我カ民族ノ滅亡ヲ招来スルノミナラス延テ人類ノ文明ヲモ破却スヘシ').should.equal('而モ尙交戰ヲ繼續セムカ終ニ我カ民族ノ滅亡ヲ招來スルノミナラス延テ人類ノ文明ヲモ破却スヘシ');
			kyujitai.encode('斯ノ如クムハ朕何ヲ以テカ億兆ノ赤子ヲ保シ皇祖皇宗ノ神霊ニ謝セムヤ').should.equal('斯ノ如クムハ朕何ヲ以テカ億兆ノ赤子ヲ保シ皇祖皇宗ノ神靈ニ謝セムヤ');
			kyujitai.encode('是レ朕カ帝国政府ヲシテ共同宣言ニ応セシムルニ至レル所以ナリ').should.equal('是レ朕カ帝國政府ヲシテ共同宣言ニ應セシムルニ至レル所以ナリ');
			kyujitai.encode('朕ハ帝国ト共ニ終始東亜ノ解放ニ協力セル諸盟邦ニ対シ遺憾ノ意ヲ表セサルヲ得ス').should.equal('朕ハ帝國ト共ニ終始東亞ノ解放ニ協力セル諸盟邦ニ對シ遺憾ノ意ヲ表セサルヲ得ス');
			kyujitai.encode('帝国臣民ニシテ戦陣ニ死シ職域ニ殉シ非命ニ斃レタル者及其ノ遺族ニ想ヲ致セハ').should.equal('帝國臣民ニシテ戰陣ニ死シ職域ニ殉シ非命ニ斃レタル者及其ノ遺族ニ想ヲ致セハ');
			kyujitai.encode('五内為ニ裂ク且戦傷ヲ負ヒ災禍ヲ蒙リ家業ヲ失ヒタル者ノ厚生ニ至リテハ朕ノ深ク軫念スル所ナリ').should.equal('五內爲ニ裂ク且戰傷ヲ負ヒ災禍ヲ蒙リ家業ヲ失ヒタル者ノ厚生ニ至リテハ朕ノ深ク軫念スル所ナリ');
			kyujitai.encode('惟フニ今後帝国ノ受クヘキ苦難ハ固ヨリ尋常ニアラス爾臣民ノ衷情モ朕善ク之ヲ知ル').should.equal('惟フニ今後帝國ノ受クヘキ苦難ハ固ヨリ尋常ニアラス爾臣民ノ衷情モ朕善ク之ヲ知ル');
			kyujitai.encode('然レトモ朕ハ時運ノ趨ク所堪ヘ難キヲ堪ヘ忍ヒ難キヲ忍ヒ以テ万世ノ為ニ太平ヲ開カムト欲ス').should.equal('然レトモ朕ハ時運ノ趨ク所堪ヘ難キヲ堪ヘ忍ヒ難キヲ忍ヒ以テ萬世ノ爲ニ太平ヲ開カムト欲ス');
			kyujitai.encode('朕ハ茲ニ国体ヲ護持シ得テ忠良ナル爾臣民ノ赤誠ニ信倚シ常ニ爾臣民ト共ニ在リ').should.equal('朕ハ茲ニ國體ヲ護持シ得テ忠良ナル爾臣民ノ赤誠ニ信倚シ常ニ爾臣民ト共ニ在リ');
			kyujitai.encode('若シ夫レ情ノ激スル所濫ニ事端ヲ滋クシ或ハ同胞排擠互ニ時局ヲ乱リ為ニ大道ヲ誤リ信義ヲ世界ニ失フカ如キハ朕最モ之ヲ戒ム').should.equal('若シ夫レ情ノ激スル所濫ニ事端ヲ滋クシ或ハ同胞排擠互ニ時局ヲ亂リ爲ニ大道ヲ誤リ信義ヲ世界ニ失フカ如キハ朕最モ之ヲ戒ム');
			kyujitai.encode('宜シク挙国一家子孫相伝ヘ確ク神州ノ不滅ヲ信シ任重クシテ道遠キヲ念ヒ総力ヲ将来ノ建設ニ傾ケ').should.equal('宜シク擧國一家子孫相傳ヘ確ク神州ノ不滅ヲ信シ任重クシテ道遠キヲ念ヒ總力ヲ將來ノ建設ニ傾ケ');
			kyujitai.encode('道義ヲ篤クシ志操ヲ鞏クシ誓テ国体ノ精華ヲ発揚シ世界ノ進運ニ後レサラムコトヲ期スヘシ').should.equal('道義ヲ篤クシ志操ヲ鞏クシ誓テ國體ノ精華ヲ發揚シ世界ノ進運ニ後レサラムコトヲ期スヘシ');
			kyujitai.encode('爾臣民其レ克ク朕カ意ヲ体セヨ').should.equal('爾臣民其レ克ク朕カ意ヲ體セヨ');
			done();
		});
	});
});
