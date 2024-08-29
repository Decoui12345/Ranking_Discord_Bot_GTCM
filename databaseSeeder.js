// databaseSeeder.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedDatabase() {
    const mongoURI = process.env.MONGODB_URI;
    const users = [
        // Diamond:
                    { username: 'goofyahchef',              userId: '763906346633527316',    rank: '1143694702042947614', position: 1 },
                    { username: 'kranch2465',               userId: '801227845074288650',    rank: '1143694702042947614', position: 2 },            
                    { username: 'galfgalf',                 userId: '727691232335102003',    rank: '1143694702042947614', position: 3 },
        // Plat:
                    { username: 'bananaman4786',            userId: '762838922166272010',    rank: '1143697130511409193', position: 1 },
                    { username: 'wompwomp105',              userId: '1059535579332755569',   rank: '1143697130511409193', position: 2 },
                    { username: 'jakethedragon16',          userId: '582347178891018250',    rank: '1143697130511409193', position: 3 },
                    { username: 'hqmatrixmod',              userId: '435591373207371776',    rank: '1143697130511409193', position: 4 },
        // Gold:
                    { username: 'tbone7349',                userId: '704476270376779917',    rank: '1143698998872514560', position: 1 },
                    { username: 'pearson6969.',             userId: '1116149148480180264',   rank: '1143698998872514560', position: 2 },
                    { username: '_ice.king_',               userId: '1264743269796024322',   rank: '1143698998872514560', position: 3 },
                    { username: 'artificial3216',           userId: '567818660127965185',    rank: '1143698998872514560', position: 4 },
                    { username: 'mrs_bean_jay',             userId: '875992509225001020',    rank: '1143698998872514560', position: 5 },
                    { username: 'vexzl_22',                 userId: '577984048341975064',    rank: '1143698998872514560', position: 6 },
                    { username: 'moist_ceiling_fan',        userId: '533822037374795816',    rank: '1143698998872514560', position: 7 },
                    { username: '.unfunnyman.',             userId: '1169791990263726151',   rank: '1143698998872514560', position: 8 },
                    { username: 'kaixdpk123',               userId: '1265834541352882289',   rank: '1143698998872514560', position: 9 },
                    { username: 'perc30cc',                 userId: '1011804941704253500',   rank: '1143698998872514560', position: 10 },

        // Silver: 
                    { username: 'zyler_999',                userId: '1011020470499422288',   rank: '1143702378244219050', position: 1 },
                    { username: 'goldsword245',             userId: '812126765153124422',    rank: '1143702378244219050', position: 2 },
                    { username: 'razorsaurus4735',          userId: '934200728015224833',    rank: '1143702378244219050', position: 3 },
                    { username: 'shlong_w0ng',              userId: '1268270991189082227',   rank: '1143702378244219050', position: 4 },
                    { username: 'hank_him',                 userId: '1173325605773779127',   rank: '1143702378244219050', position: 5 },
                    { username: 'itamemario57',             userId: '1106329606526599209',   rank: '1143702378244219050', position: 6 },
                    { username: 'zach24254',                userId: '849090882019786753',    rank: '1143702378244219050', position: 7 },
                    { username: 'mooseman0239',             userId: '1212206975761514496',   rank: '1143702378244219050', position: 8 },
                    { username: 'russianhati',              userId: '1130543221399887882',   rank: '1143702378244219050', position: 9 },
                    { username: 'sugma_b',                  userId: '600793637764333636',    rank: '1143702378244219050', position: 10 },
                    { username: 'jittrippin0835',           userId: '872655373000146976',    rank: '1143702378244219050', position: 11 },
                    { username: 'applejuice900_31700',      userId: '1208590082789871627',   rank: '1143702378244219050', position: 12 },
                    { username: 'turfhut',                  userId: '931712371993493544',    rank: '1143702378244219050', position: 13 },
                    //{ username: 'galfgalf',               userId: '727691232335102003',    rank: '1143702378244219050', position: 1 },
                    { username: 'lj32wf',                   userId: '761353277077061652',    rank: '1143702378244219050', position: 14 },
                    { username: 'bingus9757',               userId: '699286427304984646',    rank: '1143702378244219050', position: 15 },
                    { username: 'notcole09',                userId: '986351780143202385',    rank: '1143702378244219050', position: 16 },
                    { username: 'thejrbrosyt',              userId: '1067588238929305642',   rank: '1143702378244219050', position: 17 },
                    { username: 'nobody_cares11',           userId: '1038175568224591963',   rank: '1143702378244219050', position: 18 },
                    { username: 'yeaaaaaaah',               userId: '452157471088443392',    rank: '1143702378244219050', position: 19 },
                    { username: 'guy778',                   userId: '1013298286481911854',   rank: '1143702378244219050', position: 20 },
                    { username: 'sky_32t',                  userId: '1197256922538197144',   rank: '1143702378244219050', position: 21 },
                    { username: 'xspectorlax',              userId: '996917369991610368',    rank: '1143702378244219050', position: 22 },
                    { username: 'daddypurple.',             userId: '807261837292339200',    rank: '1143702378244219050', position: 23 },

        // Iron:
                    { username: 'fx4tal',                   userId: '1008413908593279077',   rank: '1143704641398386718', position: 1 },
                    { username: 'dinotiger01',              userId: '775460861350641696',    rank: '1143704641398386718', position: 2 },
                    { username: 'tayson0017',               userId: '1150940226391384264',   rank: '1143704641398386718', position: 3 },
                    { username: 'branch26',                 userId: '557551717915295774',    rank: '1143704641398386718', position: 4 },
                    { username: 'turtleman',                userId: '975040989519564830',    rank: '1143704641398386718', position: 5 },
                    { username: 'quipshard',                userId: '1053387634019418283',   rank: '1143704641398386718', position: 6 },
                    { username: 'smores8244',               userId: '1065091567230124065',   rank: '1143704641398386718', position: 7 },
                    { username: 'jdxbeatbox',               userId: '1090144604063547452',   rank: '1143704641398386718', position: 8 },
                    { username: '_scp173',                  userId: '1025562735141978133',   rank: '1143704641398386718', position: 9 },

        // Copper:
                    { username: 'bigboy214',                userId: '714693544287141960',    rank: '1201228978183221439', position: 1 },
                    { username: 'darkangelblossom.',        userId: '793212392795930664',    rank: '1201228978183221439', position: 2 },
                    //{ username: 'galfgalf',               userId: '727691232335102003',    rank: '1201228978183221439', position: 1 },
                    { username: 'hengar_yt',                userId: '1130388684466831454',   rank: '1201228978183221439', position: 3 },

    ];
    
    const client = new MongoClient(mongoURI);
    
    try {
        await client.connect();
        const db = client.db('rankPosition');
        
        // Check if the users collection is empty
        const count = await db.collection('users').countDocuments();
        if (count === 0) {
            // Batch insert users
            const batchSize = 100; // Adjust batch size as needed
            for (let i = 0; i < users.length; i += batchSize) {
                const batchUsers = users.slice(i, i + batchSize);
                await db.collection('users').insertMany(batchUsers);
                console.log(`Inserted ${batchUsers.length} users`);
            }
            console.log('User data inserted successfully');
        } else {
            console.log('Users collection is not empty. Skipping insertion.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

module.exports = seedDatabase;






/* // ✅Diamond:
    { username: 'galfgalf',                 userId: '727691232335102003',   rank: '1143694702042947614', position: 1 },
    { username: 'goofyahchef',              userId: '763906346633527316',   rank: '1143694702042947614', position: 2 },
    { username: 'oogabooga0571',            userId: '1130631580478603416',  rank: '1143694702042947614', position: 3 },
    { username: 'crispyflow',               userId: '814937594319601684',   rank: '1143694702042947614', position: 4 },
    { username: '._devilll_.',              userId: '916439765291765771',   rank: '1143694702042947614', position: 5 },
    { username: 'assassin273',              userId: '720443601061937226',   rank: '1143694702042947614', position: 6 },
    { username: '67hr_r',                   userId: '422865108230995969',   rank: '1143694702042947614', position: 7 },
    { username: 'kranch2465',               userId: '801227845074288650',   rank: '1143694702042947614', position: 8 },
// ✅Platinum:
    { username: 'bckofthenet.',             userId: '1105592655838191687',  rank: '1143697130511409193', position: 1 },
    { username: 'mysticoperator1',          userId: '1173452023270740079',  rank: '1143697130511409193', position: 2 },
    { username: 'xaviartheking',            userId: '991257026413989908',   rank: '1143697130511409193', position: 3 },
    { username: 'verithian',                userId: '822948660853473300',   rank: '1143697130511409193', position: 4 },
    { username: 'wompwomp105',              userId: '1059535579332755569',  rank: '1143697130511409193', position: 5 },
    { username: 'chefhenrish',              userId: '552579906979102724',   rank: '1143697130511409193', position: 6 },
// ✅Gold:
    { username: 'jakethedragon16',          userId: '582347178891018250',   rank: '1143698998872514560', position: 1 },
    { username: 'legalzo',                  userId: '659816540232744984',   rank: '1143698998872514560', position: 2 },
    // { username: 'Minty',                 userId: '1113137365838467176',  rank: '1143698998872514560', position: 3 },
    { username: 'hqmatrixmod',              userId: '435591373207371776',   rank: '1143698998872514560', position: 3 },
    { username: 'mike.1319',                userId: '268474339605610506',   rank: '1143698998872514560', position: 4 },
    { username: 'bananaman4786',            userId: '762838922166272010',   rank: '1143698998872514560', position: 5 },
    //{ username: 'Greek',                  userId: '282859044593598464',   rank: '1143698998872514560', position: 2 },
    { username: 'tbone7349',                userId: '704476270376779917',   rank: '1143698998872514560', position: 6 },
    { username: 'jacocat',                  userId: '493586485535309825',   rank: '1143698998872514560', position: 7 },
    { username: 'pearson6969.',             userId: '1116149148480180264',  rank: '1143698998872514560', position: 8 },
    { username: 'scragoff',                 userId: '663658755690594334',   rank: '1143698998872514560', position: 9 },
    { username: 'toygon',                   userId: '812539692372590653',   rank: '1143698998872514560', position: 10 },
    { username: 'ice_king_',                userId: '837064114593464321',   rank: '1143698998872514560', position: 11 },
    { username: 'vexzl_22',                 userId: '577984048341975064',   rank: '1143698998872514560', position: 12 },
    { username: 'firechicken07',            userId: '732733048176771152',   rank: '1143698998872514560', position: 13 },
    // { username: 'zoro',                  userId: '1222239204923150336',  rank: '1143698998872514560', position: 3 },
    { username: '.unfunnyman.',             userId: '1169791990263726151',  rank: '1143698998872514560', position: 14 },
    { username: '_piano_',                  userId: '825127036737683456',   rank: '1143698998872514560', position: 15 },
   // { username: 'Enferno',                userId: '1222239204923150336',  rank: '1143698998872514560', position: 3 },
    { username: 'artificial3216',           userId: '567818660127965185',   rank: '1143698998872514560', position: 16 },
// ✅Silver:
    { username: 'jackhofff',                userId: '927366122599223357',   rank: '1143702378244219050', position: 1 },
    { username: 'polarpod3',                userId: '792102281452453948',   rank: '1143702378244219050', position: 2 },
    { username: 'fellasinparis96',          userId: '1131358004504182835',  rank: '1143702378244219050', position: 3 },
    { username: 'him2786',                  userId: '772255339177181186',   rank: '1143702378244219050', position: 4 },
    { username: 'moist_ceiling_fan',        userId: '533822037374795816',   rank: '1143702378244219050', position: 5 },
    { username: 'shadowz_vr',               userId: '1022172570390380544',  rank: '1143702378244219050', position: 6 },
    { username: 'goldsword245',             userId: '812126765153124422',   rank: '1143702378244219050', position: 7 },
    { username: 'g0d32',                    userId: '1221900172699631743',  rank: '1143702378244219050', position: 8 },
    { username: 'zyler_999',                userId: '1011020470499422288',  rank: '1143702378244219050', position: 9 },
    { username: 'yahoo_ninja',              userId: '497871291580416015',   rank: '1143702378244219050', position: 10 },
    { username: 'me_hi_hi8',                userId: '677670436481400845',   rank: '1143702378244219050', position: 11 },
    { username: 'ph0enix_.',                userId: '690319704358912152',   rank: '1143702378244219050', position: 12 },
    { username: 'penelope0969',             userId: '1212675205755838495',  rank: '1143702378244219050', position: 13 },
    { username: 'yeaaaaaaah',               userId: '452157471088443392',   rank: '1143702378244219050', position: 14 },
    { username: 'mooseman0239',             userId: '1212206975761514496',  rank: '1143702378244219050', position: 15 },
    { username: 'razorsaurus4735',          userId: '934200728015224833',   rank: '1143702378244219050', position: 16 },
    { username: 'crankyrhombus31',          userId: '851190624479608852',   rank: '1143702378244219050', position: 17 },
    { username: 'voidsharppoint',           userId: '924466032410759238',   rank: '1143702378244219050', position: 18 },
    { username: 'ttvzoom',                  userId: '1147219943394377809',  rank: '1143702378244219050', position: 19 },
    { username: 'cjt1234',                  userId: '1074376082020630538',  rank: '1143702378244219050', position: 20 },
    { username: 'hybridsavior',             userId: '707965452382371881',   rank: '1143702378244219050', position: 21 },
    { username: 'notcole09',                userId: '986351780143202385',   rank: '1143702378244219050', position: 22 },
    { username: 'superdriller',             userId: '1175953803288264830',  rank: '1143702378244219050', position: 23 },
    { username: 'applejuice900_31700',      userId: '1208590082789871627',  rank: '1143702378244219050', position: 24 },
    { username: 'soggiecereal',             userId: '766828024141185055',   rank: '1143702378244219050', position: 25 },
    { username: 'mrbean_gtag',              userId: '1211076406730301521',  rank: '1143702378244219050', position: 26 },
// ✅Iron:
    { username: 'hades_39',                 userId: '1114665754013474926',  rank: '1143704641398386718', position: 1 },
    { username: 's4ndistasty',              userId: '774791038198874173',   rank: '1143704641398386718', position: 2 },
    //{ username: 'joyful',                 userId: '',                     rank: '1143704641398386718', position: 2 },
    { username: 'manticoreman',             userId: '935282681590218803',   rank: '1143704641398386718', position: 3 },
    { username: 'branch26',                 userId: '557551717915295774',   rank: '1143704641398386718', position: 4 },
    { username: 'blackmintemerald',         userId: '536076753454759956',   rank: '1143704641398386718', position: 5 },
    { username: 'fireekfc',                 userId: '1234274705939103815',  rank: '1143704641398386718', position: 6 },
    { username: 'kboi3006',                 userId: '1024753442260000871',  rank: '1143704641398386718', position: 7 },
    { username: 'ticklemonster358',         userId: '751981384410726401',   rank: '1143704641398386718', position: 8 },
    { username: 'drake063755',              userId: '776672802484256768',   rank: '1143704641398386718', position: 9 },
    { username: 'lj32wf',                   userId: '761353277077061652',   rank: '1143704641398386718', position: 10 },
    { username: 'pinkvrlife',               userId: '940456671556284416',   rank: '1143704641398386718', position: 11 },
    //{ username: 'verx',                   userId: '',                     rank: '1143704641398386718', position: 10 },
    { username: 'soverignofgravy',          userId: '787859009230340107',   rank: '1143704641398386718', position: 12 },
    { username: 'sugma_b',                  userId: '600793637764333636',   rank: '1143704641398386718', position: 13 },
    { username: 'obamatheprism',            userId: '795686863733391390',   rank: '1143704641398386718', position: 14 },
    { username: 'wannabeatc',               userId: '859854855064911903',   rank: '1143704641398386718', position: 15 },
    { username: 'sirknight557',             userId: '897584116843823155',   rank: '1143704641398386718', position: 16 },
    { username: 'milktop1',                 userId: '792456953892831252',   rank: '1143704641398386718', position: 17 },
    { username: 'sh3_vr',                   userId: '1165722850511028345',  rank: '1143704641398386718', position: 18 },
    { username: 'dinotiger01',              userId: '775460861350641696',   rank: '1143704641398386718', position: 19 },
    { username: 'chloewinz',                userId: '822842282406576159',   rank: '1143704641398386718', position: 20 },
    //{ username: 'winzz',                  userId: '',                     rank: '1143704641398386718', position: 16 },
    { username: 'jimmy_urmom76',            userId: '1042929929806950421',  rank: '1143704641398386718', position: 21 },
    //{ username: 'jermonke',               userId: '',                     rank: '1143704641398386718', position: 20 },
    //{ username: 'lemon',                  userId: '',                     rank: '1143704641398386718', position: 19 },
    { username: 'nickk2586',                userId: '953181762782117888',   rank: '1143704641398386718', position: 22 },

// Copper:
    //{ username: 'burgerking',             userId: '',                     rank: '',                    position: 1 },
    { username: 'horseflythefly',           userId: '1137611021373165629',  rank: '1201228978183221439', position: 1 },
    { username: 'agreedtag776070',          userId: '1167925747025973341',  rank: '1201228978183221439', position: 2 },
    { username: 'heartsulfer',              userId: '1201434917712691213',  rank: '1201228978183221439', position: 3 },
    { username: 'eggplant04',               userId: '615786654141120522',   rank: '1201228978183221439', position: 4 },
    { username: 'jdxbeatbox',               userId: '1090144604063547452',  rank: '1201228978183221439', position: 5 },
    { username: 'asumasarutobi.',           userId: '870823957987733565',   rank: '1201228978183221439', position: 6 },
    { username: 'artissed',                 userId: '1061653647915757628',  rank: '1201228978183221439', position: 7 },
    //{ username: 'juniper',                userId: '',                     rank: '1201228978183221439', position: 6 },
    { username: 'no_face_yet2',             userId: '1112925855170187374',  rank: '1201228978183221439', position: 8 },
    { username: 'daddypurple.',             userId: '807261837292339200',   rank: '1201228978183221439', position: 9 },
    { username: 'maxninja081358',           userId: '957975626571214879',   rank: '1201228978183221439', position: 10 },
    { username: 'wes_9',                    userId: '1069456773548884029',  rank: '1201228978183221439', position: 11 },
    //{ username: 'iceman',                 userId: '',                     rank: '1201228978183221439', position: 10 },
    { username: 'darkangelblossom',         userId: '793212392795930664',   rank: '1201228978183221439', position: 12 },
    { username: 'zeldafreak.',              userId: '925508788130291732',   rank: '1201228978183221439', position: 13 },
    { username: 'zbn1l',                    userId: '982414168852402206',   rank: '1201228978183221439', position: 14 },
    { username: 'anyone._someone',          userId: '671119579098906665',   rank: '1201228978183221439', position: 15 },
    { username: 'mistthecaster',            userId: '1046902380924506324',  rank: '1201228978183221439', position: 16 }, */