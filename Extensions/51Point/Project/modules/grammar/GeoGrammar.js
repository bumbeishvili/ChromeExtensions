Methods = {}
Grammar = {}


ArgumentList= {
        //xmovan fudziani gamonaklisi sakutari saxelebi
        xmovanFudzianiGamonaklisiSakutariSaxelebi: ['ნანული', 'აკაკი',
            'გიორგი', 'გოდერძი'
        ]
 }
Methods = {
    gamonaklisiSakutariSaxelia: function(sakutariSaxeli) {
        var gamonaklisebi = ArgumentList.xmovanFudzianiGamonaklisiSakutariSaxelebi;
        for (var i = 0; i < gamonaklisebi.length; i++) {
            if (gamonaklisebi[i] == sakutariSaxeli) {
                return true;
            }
        }
        return false;
    },
    xmovanFudzianiSakutariSaxelia: function(sakutariSaxeli) {
        if (sakutariSaxeli.length < 5) return true;
        if (Methods.gamonaklisiSakutariSaxelia(sakutariSaxeli))
			return true;
        switch (sakutariSaxeli[sakutariSaxeli.length - 1]) {
            case 'ა':
            case 'ე':
            case 'ო':
            case 'უ':
                return true;
        }
        return false;
    },
    tanxmovnitMtavrdeba: function(sityva) {
        switch (sityva[sityva.length - 1]) {
            case 'ა':
            case 'ე':
            case 'ი':
            case 'ო':
            case 'უ':
                return false;
        }
        return true;
    },
    BruSakSaxSax: function(sakutariSaxeli) {
        return sakutariSaxeli;
    },
	
    BruSakSaxMot: function(sakutariSaxeli) {
        if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli + 'მ';
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return	sakutariSaxeli+'მა';
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)+'მა'
    },
    BruSakSaxMic: function(sakutariSaxeli) {
		if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli + 'ს';
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return	sakutariSaxeli+'ს';
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)+'ს'
	},
    BruSakSaxNat: function(sakutariSaxeli) {
		if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli + 'სი';
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return	sakutariSaxeli+'ის';
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)+'ის'
	},
    BruSakSaxMoq: function(sakutariSaxeli) {
		if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli + 'თი';
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return	sakutariSaxeli+'ით';
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)+'ით'
	},
    BruSakSaxVit: function(sakutariSaxeli) {
		if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli + 'დ';
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return	sakutariSaxeli+'ად';
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)+'ად'
	},
    BruSakSaxWod: function(sakutariSaxeli) {
        if (Methods.xmovanFudzianiSakutariSaxelia(sakutariSaxeli))
            return sakutariSaxeli;
        if (Methods.tanxmovnitMtavrdeba(sakutariSaxeli))
			return sakutariSaxeli;
        return sakutariSaxeli.substring(0, sakutariSaxeli.length - 1)
    }
};

function test() {
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Saxelobitshi('ნინიკო'))
    console.log('==================================================');
	console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Motxrobitshi('ნინიკო'))
    console.log('==================================================');
	console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Micemitshi('ნინიკო'))
    console.log('==================================================');
	console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Natesaobitshi('ნინიკო'))
    console.log('==================================================');
	console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Moqmedebitshi('ნინიკო'))
    console.log('==================================================');
	console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Vitarebitshi('ნინიკო'))
    console.log('==================================================');
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('დავითი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('გიორგი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('ქეთევანი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('თამარ'))
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('ლალი'))
    console.log(Grammar.Abrune.SakutariSaxeli.Wodebitshi('ნინიკო'))
}

Grammar = {
    Abrune: {
        SakutariSaxeli: {
            Saxelobitshi: Methods.BruSakSaxSax,
            Motxrobitshi: Methods.BruSakSaxMot,
            Micemitshi: Methods.BruSakSaxMic,
            Natesaobitshi: Methods.BruSakSaxNat,
            Moqmedebitshi: Methods.BruSakSaxMoq,
            Vitarebitshi: Methods.BruSakSaxVit,
            Wodebitshi: Methods.BruSakSaxWod
        }
    }
}