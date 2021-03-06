# Flatiron Batch Progress Report Generator

Ever wish you could see which students finished which lessons without having to click on each and every lesson manually? Maybe you want to see how a few particular students are doing in labs, but Learn doesn't provide an intuitive filter for that.

![Demo](./demo.gif)

Open up the Chrome Developer Tools in a Learn.co webpage. Copy and paste the source code from `script.min.js` into the console and replace the batchId and trackId (you can find this information from the Network tab).

You'll see a break down of each and every student's individual lessons progress. This works for PREWORK as well:
* ✅ The lesson is complete
* 💪 The lesson is in progress
* ❌ The lesson has not been started


### Bookmark Option

Alternatively, you can paste the following code (also found in `bookmarklet.js`) into a bookmark in the "URL" section.

Once this bookmark is saved, while on a Learn.co batch page click the bookmark and add the Batch ID and Track ID to the corresponding prompts.

```
javascript:(function(){var batchId=prompt("enter batch ID"),trackId=prompt("enter track ID");function init(){let o=`https://learn.co/api/v1/batches/${batchId}/tracks/${trackId}/deployed`,t=fetch(`https://learn.co/api/v1/batches/${batchId}/tracks/${trackId}/progress`).then(o=>o.json()),e=fetch(o).then(o=>o.json());Promise.all([t,e]).then(o=>{getIndividualData(o[0].map(o=>(o.lessons=[],o)),o[1])})}function getIndividualData(o,t){let e=[],s=1;t.topics.forEach(o=>{o.units.forEach(o=>{o.lessons.forEach(o=>{let t=fetch(`https://learn.co/api/v1/batches/${batchId}/lessons/${o.node.id}`).then(o=>(console.log(`Fetched ${s} lessons`),s++,o.json()));e.push(t)})})}),Promise.all(e).then(t=>{compileResults(o,t)})}function compileResults(o,t){t.forEach(t=>{t.students.forEach(e=>{let s,l=o.find(o=>o.id===e.id);e.completed_at?s="✅ ":e.started_at&&!e.completed_at?s="💪 ":e.started_at||(s="❌ "),s+=t.title,l.lessons.push(s)})}),printStudentProgress(o)}function printStudentProgress(o){console.log("************************************************************************"),console.log("******************************START REPORT******************************"),console.log("************************************************************************"),console.log(""),o.forEach(o=>{console.log(o.full_name),console.log("------------------------------------------------------"),o.lessons.forEach(o=>{console.log("|"+o)}),console.log("------------------------------------------------------"),console.log("")}),console.log("************************************************************************"),console.log("*******************************END REPORT*******************************"),console.log("************************************************************************")}init()})()
```

![Bookmarklet](./bookmarklet.png)
