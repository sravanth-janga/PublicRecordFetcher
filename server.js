const dgram = require('dgram');
const udpsocket = dgram.createSocket('udp4');
udpsocket.bind({port:8080,exclusive:true});
// >>>>>>>>>>> document interface <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const docinter = {
        name:'',
        email:'',
        phone:'',
        city:'',
    }

////////////////////////////////////////////////////////////////////////////
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< MONGO CLUSTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const MongoClient = require('mongodb').MongoClient;
const dbname = 'public';
var db;
const uri = "mongodb+srv://labuser:labuser@records.vyncx.mongodb.net/public?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect().then((client)=>{
    db = client.db(dbname);
    console.log('connected to ',dbname);
    
})
/* makeconnection = async()=>{
    try{    
        await client.connect();
        console.log('Connected to the database!');
        const db = client.db(dbname);
        flag=true;

    }catch(err){
        console.log('couldn\'t make a connection ',err);
    }
}
makeconnection().catch(console.dir); */

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
///////////////////////////////////////////////////////////////////////////////

udpsocket.on('listening',()=>{
    console.log('im listening!')
});
udpsocket.on('message',(msg,info)=>{
    var reqobj = JSON.parse(msg.toString());
    console.log(reqobj)
    const col = db.collection('records');
    const fetch = async ()=>{
        //var buffarr = new ArrayBuffer();
        var projection = {}
        projection['_id']=0
        projection['name']=1;
         reqobj.phone?projection['phone']=1:0;
        reqobj.email?projection['email']=1:0;
        reqobj.city?projection['city']=1:0;
        const cursor = col.find({name: reqobj.mat ?reqobj.name:new RegExp(reqobj.name,'i')}).project(projection).limit(Number(reqobj.limit));
        console.log('fetching..............');
        docs = await cursor.toArray();
        sendbuf = Buffer.from(JSON.stringify(docs));
        console.log('ddocs',docs)
        udpsocket.send(sendbuf,info.port,info.address,(err)=>{
            if(err){console.log(err);}
        });
    }
    const post = async ()=>{
        //var query = {name:reqobj.name}

        const query = { name: reqobj.name };
        const update = {$set:
            {name:reqobj.name,
                city:reqobj.city,
                email:reqobj.email,
                phone:reqobj.phone    
            }};
        const options = {upsert: true};
        await col.updateOne(query, update, options);
        
        udpsocket.send('Added successfully!',info.port,info.address,(err)=>{
            if(err){console.log(err);}
        });
    }

    if(reqobj.method.match('post')){
        console.log('posting----------------')
        post().catch(err=>{console.log('the error is',err)})
    }else{
        fetch()
    }
  
 /*    var doci = {...docinter}
    doci.name='sravanthjanga';
    doci.email='sravanth.unity@gmail.com';
    doci.phone='78889975658';
    doci.city='Hyderabad';
    col.insertOne(doci).then((msg)=>{
        console.log('doc inserted succesfully!',msg)
    }) */

    ;

    console.log('processing..........')
  
})

