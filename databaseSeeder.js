// databaseSeeder.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedDatabase() {
    const mongoURI = process.env.MONGODB_URI;
    const users = [
    // ✅Diamond:
        { username: 'galfgalf',      userId: '727691232335102003',   rank: '1143694702042947614', position: 1 },
        { username: 'goofyahchef',            userId: '763906346633527316',   rank: '1143694702042947614', position: 2 },
        { username: 'oogabooga0571',             userId: '1130631580478603416',  rank: '1143694702042947614', position: 3 },
        { username: 'crispyflow',           userId: '814937594319601684',   rank: '1143694702042947614', position: 4 },
        { username: '._devilll_.',            userId: '916439765291765771',   rank: '1143694702042947614', position: 5 },
        { username: 'assassin273',         userId: '720443601061937226',   rank: '1143694702042947614', position: 1 },
        { username: '67hr_r',             userId: '422865108230995969',   rank: '1143694702042947614', position: 2 },
        { username: 'kranch2465',        userId: '801227845074288650',  rank: '1143694702042947614', position: 3 },
    // ✅Platinum:
        { username: 'bckofthenet.',              userId: '1105592655838191687',   rank: '1143698998872514560', position: 1 },
        { username: 'mysticoperator1',             userId: '1173452023270740079',   rank: '1143698998872514560', position: 2 },
        { username: 'xaviartheking',            userId: '991257026413989908',   rank: '1143698998872514560', position: 3 },
        { username: 'verithian',       userId: '822948660853473300',   rank: '1143698998872514560', position: 4 },
        { username: 'wompwomp105',         userId: '1059535579332755569',  rank: '1143698998872514560', position: 5 },
        { username: 'chefhenrish',       userId: '552579906979102724',  rank: '1143698998872514560', position: 6 },
    // ✅Gold:
        { username: 'jakethedragon16',        userId: '582347178891018250',   rank: '1143697130511409193', position: 1 },
        { username: 'legalzo',            userId: '659816540232744984',   rank: '1143697130511409193', position: 2 },
        // { username: 'Minty',         userId: '1113137365838467176',  rank: '1197029346188214273', position: 3 },
        { username: 'hqmatrixmod',             userId: '435591373207371776',   rank: '1143697130511409193', position: 3 },
        { username: 'mike.1319',             userId: '268474339605610506',   rank: '1143697130511409193', position: 4 },
        { username: 'bananaman4786',        userId: '762838922166272010',   rank: '1143697130511409193', position: 5 },
        //{ username: 'Greek',            userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'tbone7349',    userId: '704476270376779917',  rank: '1143697130511409193', position: 6 },
        { username: 'jacocat',             userId: '493586485535309825',   rank: '1143697130511409193', position: 7 },
        { username: 'pearson6969.',          userId: '1116149148480180264',   rank: '1143697130511409193', position: 8 },
        { username: 'scragoff',            userId: '663658755690594334',  rank: '1143697130511409193', position: 9 },
        { username: 'toygon',           userId: '812539692372590653',   rank: '1143697130511409193', position: 10 },
        { username: 'ice_king_',          userId: '837064114593464321',   rank: '1143697130511409193', position: 11 },
        { username: 'vexzl_22',              userId: '577984048341975064',   rank: '1143697130511409193', position: 12 },
        { username: 'firechicken07',      userId: '732733048176771152',   rank: '1143697130511409193', position: 13 },
        // { username: 'zoro',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: '.unfunnyman.',            userId: '1169791990263726151',   rank: '1143697130511409193', position: 14 },
        { username: '_piano_',            userId: '825127036737683456',   rank: '1143697130511409193', position: 15 },
       // { username: 'Enferno',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
    // Silver:
        { username: 'jackhofff',         userId: '927366122599223357',   rank: '1197029372616515676', position: 4 },
        { username: 'polarpod3',             userId: '792102281452453948',   rank: '1197029372616515676', position: 5 },
        { username: 'fellasinparis96',          userId: '1131358004504182835',   rank: '1197029383072915456', position: 1 },
        { username: 'him2786',             userId: '772255339177181186',   rank: '1197029383072915456', position: 2 },
        { username: 'moist_ceiling_fan',             userId: '533822037374795816',  rank: '1197029383072915456', position: 3 },
        { username: 'artificial3216',       userId: '567818660127965185',  rank: '1197029383072915456', position: 4 },
        // { username: 'misfortune',       userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'goldsword245',        userId: '812126765153124422',   rank: '1197029346188214273', position: 2 },
        { username: 'g0d32',             userId: '1221900172699631743',  rank: '1197029346188214273', position: 3 },
        { username: 'zyler_999',            userId: '1011020470499422288',   rank: '1197029346188214273', position: 4 },
        { username: 'yahoo_ninja',       userId: '497871291580416015',   rank: '1197029346188214273', position: 5 },
        { username: 'me_hi_hi8',        userId: '677670436481400845',   rank: '1197029372616515676', position: 1 },
        { username: 'ph0enix_.',          userId: '690319704358912152',   rank: '1197029372616515676', position: 2 },
        { username: 'penelope0969',    userId: '1212675205755838495',  rank: '1197029372616515676', position: 3 },
        // { username: 'lemin',                             userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'mooseman0239',                            userId: '1212206975761514496',   rank: '1197029346188214273', position: 2 },
        { username: 'razorsaurus4735',                  userId: '934200728015224833',  rank: '1197029346188214273', position: 3 },
        { username: 'crankyrhombus31',                      userId: '851190624479608852',   rank: '1197029346188214273', position: 4 },
        { username: 'voidsharppoint',                            userId: '924466032410759238',   rank: '1197029346188214273', position: 5 },
        { username: 'ttvzoom',                         userId: '1147219943394377809',   rank: '1197029372616515676', position: 1 },
        { username: 'hybridsavior',                         userId: '707965452382371881',   rank: '1197029372616515676', position: 2 },
        { username: 'notcole09',    userId: '986351780143202385',  rank: '1197029372616515676', position: 3 },
        // { username: 'CJT',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'superdriller',                         userId: '1175953803288264830',   rank: '1197029372616515676', position: 2 },
        { username: 'applejuice900_31700',    userId: '1208590082789871627',  rank: '1197029372616515676', position: 3 },
        { username: 'soggiecereal',    userId: '766828024141185055',  rank: '1197029372616515676', position: 3 },
    // Iron:
        { username: 'hades',                          userId: '940552993609240616',   rank: '1197029372616515676', position: 4 },
        { username: 'sand',                     userId: '551608985900417024',   rank: '1197029372616515676', position: 5 },
        { username: 'joyful',                    userId: '372022813839851520',   rank: '1197029383072915456', position: 1 },
        { username: 'pumpkinboi',                     userId: '773933332396245003',   rank: '1197029383072915456', position: 2 },
        { username: 'branch',                        userId: '1135947396153614398',  rank: '1197029383072915456', position: 3 },
        { username: 'obsidenstar',       userId: '1222259786091860019',  rank: '1197029383072915456', position: 4 },
        { username: 'bomber',                             userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'kboi',                            userId: '155149108183695360',   rank: '1197029346188214273', position: 2 },
        { username: 'hi',                  userId: '1113137365838467176',  rank: '1197029346188214273', position: 3 },
        { username: 'burrito',                      userId: '773948698605781063',   rank: '1197029346188214273', position: 4 },
        { username: 'cheeseblock',                            userId: '159985870458322944',   rank: '1197029346188214273', position: 5 },
        { username: 'mr bean',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'pinklifevr',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        //{ username: 'verx',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: 'doorsniffer',                             userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'sillyboy',                            userId: '155149108183695360',   rank: '1197029346188214273', position: 2 },
        { username: 'obamaprism',                  userId: '1113137365838467176',  rank: '1197029346188214273', position: 3 },
        { username: 'wannabeATC',                      userId: '773948698605781063',   rank: '1197029346188214273', position: 4 },
        { username: 'grape',                            userId: '159985870458322944',   rank: '1197029346188214273', position: 5 },
        { username: 'sh3',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'chloe',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'winzz',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: 'jimmy',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'jermonke',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'lemon',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: 'flyingfish',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
    // Copper:
        { username: 'burgerking',                             userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'horsefly',                            userId: '155149108183695360',   rank: '1197029346188214273', position: 2 },
        { username: 'fly',                  userId: '1113137365838467176',  rank: '1197029346188214273', position: 3 },
        { username: 'sophia',                      userId: '773948698605781063',   rank: '1197029346188214273', position: 4 },
        { username: 'eggplant',                            userId: '159985870458322944',   rank: '1197029346188214273', position: 5 },
        { username: 'antivoid',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'asuma',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'artissed',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: 'juniper',                             userId: '577984048341975064',   rank: '1197029346188214273', position: 1 },
        { username: 'rai',                            userId: '155149108183695360',   rank: '1197029346188214273', position: 2 },
        { username: 'daddypurple',                  userId: '1113137365838467176',  rank: '1197029346188214273', position: 3 },
        { username: 'max',                      userId: '773948698605781063',   rank: '1197029346188214273', position: 4 },
        { username: 'wes',                            userId: '159985870458322944',   rank: '1197029346188214273', position: 5 },
        { username: 'iceman',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'dark',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'spek',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
        { username: 'cheese',                         userId: '669228505128501258',   rank: '1197029372616515676', position: 1 },
        { username: 'universal',                         userId: '282859044593598464',   rank: '1197029372616515676', position: 2 },
        { username: 'mist',    userId: '1222239204923150336',  rank: '1197029372616515676', position: 3 },
    ];

    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db('test');

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