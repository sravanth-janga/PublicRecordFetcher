const dgram = require('dgram');
const read = require('readline');
const chalk = require('chalk');
//(([a-z]*))( --email)
const udpsocket = dgram.createSocket('udp4');
udpsocket.bind({port:8180,exclusive:true});
//udpsocket.setSendBufferSize(20);

const readline = read.createInterface({
    input:process.stdin,
    output:process.stdout
});
function sendrequest(remark=''){
console.log('\n')
console.log(chalk.magenta('<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>'));
console.log('\n')
console.log(chalk.redBright(remark));
readline.question(chalk.green('\n Method GET/POST : '),(method)=>{
    const get = RegExp('get','i').exec(method);
    const post = RegExp('(post)','i').exec(method);
    res = get ? get[0].toLowerCase():(post ? post[0].toLowerCase():null);
    //console.log(get,post,res,'\n')
    if(res==null){
        sendrequest('please specify a valid method!!')
    };
    readline.question(chalk.green('\n Name : '),(name)=>{
        readline.question(chalk.green('\n PhoneNumber : '),(phn)=>{
            readline.question(chalk.green('\n Email : '),(email)=>{
                readline.question(chalk.green('\n City : '),(city)=>{
                    readline.question(chalk.yellow('\n MatchFull : '),(mat)=>{
                        readline.question(chalk.yellow('\n Max #records : '),(number)=>{
                            var limit;
                            limit = Number(number)?Number(number):0;
                           // console.log('the limit is',limit)
                            console.log(chalk.green('\n Date : '),new Date().toDateString());
                            console.log('----------------------------------------------')
                           var reqobj =  {
                               method : method,
                               name: name,
                               phone:phn,
                               email:email,
                               city:city,
                               limit:limit,
                               mat:Boolean(mat.length)
                           }
                          var buffer = Buffer.from(JSON.stringify(reqobj));
                          udpsocket.send(buffer,8080,'localhost',(err)=>{
                              if(err){
                                  console.log(err);
                              }
                        })
                  
                      })

                    })
                })
            })
        })
    })
});
}
udpsocket.on('listening',()=>{
    //console.log('im listening!');
    sendrequest();
});

udpsocket.on('message',(msg,info)=>{
    try{
    arr = JSON.parse(msg.toString())
    if (arr.length==0){
        console.log('\n')
        console.log(chalk.redBright('=============================================='));
        console.log(chalk.redBright('==             NO RECORDS FOUND!!           =='));
        console.log(chalk.redBright('=============================================='));
        console.log('\n')
    }else{
        var i  = 1;
        n = arr.length;
        for (var doc of arr){
            console.log('\n')
                console.log(chalk.blue('=============================================='));
                console.log(chalk.yellowBright`==             RECORD ${i} of ${n}          ==`);
                console.log(chalk.blue('=============================================='));
                //console.log(doc)
               for(var key in doc){
                console.log('\n')
                console.log(chalk.dim(`        ${key} : ${doc[key]}`));
                console.log(chalk.blue('=============================================='));
    
                }
          
            i ++;
            console.log('\n')
        }
    }}catch(err){
        console.log('\n')
        console.log(chalk.green('======================================'));
        console.log(chalk.greenBright(msg.toString()))
        console.log(chalk.green('======================================'));
        console.log('\n')
    }
    sendrequest();
});


console.groupEnd()