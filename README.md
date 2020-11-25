# PublicRecordFetcher
<strong> It's a { name } to { email , phone number, city } mapping application.  </strong>


<ul>
<li><h1>Requirements</h1>
<li>node.js</li>
<li>npm package manager</li>
<li>You can simply run <strong>npm install</strong> to include all other dependencies.</li>
<li>You'll need to open two seperate terminals/command promts to run this application.</li>
<li><strong>npm run client</strong> to run client side script.</li>
<li><strong>npm run server</strong> to run server side script.</li>
<li>This application uses MongodbAtlas to host the data.</li>
</li>
<li><h1>Application Layer</h1>
<ul><li>I've defined a light weight application layer protocol to communicate between client and the server.</li>
<li><h2>Header fields</h2>
<ul> 
<li><h4>Method</h4> : accepts only get or post (case insensitive ).</li>
<li><h4>Name</h4>: unique name of the person.</li>
<li><h4>Phone</h4>: phone number.</li>
<li><h4>Email</h4>: email address.</li>
<li><h4>City</h4>: name of the city.</li>
<li><h4>MatchFull</h4>: if specified fetches only records the match the name exactly as specified.</li>
<li><h4>Max#Records</h4>: maximum number of records to fetch.</li>
<li><h4>Date</h4>: a readonly date field.</li>
</ul>
</li>
</ul
</li>


</ul>
