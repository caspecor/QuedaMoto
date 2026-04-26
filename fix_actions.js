const fs = require('fs');
const path = 'src/app/(main)/meetups/actions.ts';
let content = fs.readFileSync(path, 'utf8');

const oldFunc = `export async function getPublicMeetups() {
  try {
    const res = await db.select({
      id: meetups.id,
      title: meetups.title,
      lat: meetups.lat,
      lng: meetups.lng,
    }).from(meetups).where(eq(meetups.visibility, 'public'))
    
    return { meetups: res.filter(m => m.lat !== null && m.lng !== null) }
  } catch (error) {
    console.error(error)
    return { meetups: [] }
  }
}`;

const newFunc = `export async function getPublicMeetups() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await db.select({
      id: meetups.id,
      title: meetups.title,
      lat: meetups.lat,
      lng: meetups.lng,
    }).from(meetups)
      .where(
        and(
          eq(meetups.visibility, 'public'),
          gte(meetups.date, today)
        )
      )
    
    return { meetups: res.filter(m => m.lat !== null && m.lng !== null) }
  } catch (error) {
    console.error(error)
    return { meetups: [] }
  }
}`;

// Try exact match with both LF and CRLF
if (content.includes(oldFunc)) {
    content = content.replace(oldFunc, newFunc);
    fs.writeFileSync(path, content);
    console.log('Updated getPublicMeetups (LF)');
} else {
    const oldFuncCRLF = oldFunc.replace(/\n/g, '\r\n');
    const newFuncCRLF = newFunc.replace(/\n/g, '\r\n');
    if (content.includes(oldFuncCRLF)) {
        content = content.replace(oldFuncCRLF, newFuncCRLF);
        fs.writeFileSync(path, content);
        console.log('Updated getPublicMeetups (CRLF)');
    } else {
        console.log('Pattern not found');
        // Fallback: search for a smaller part
        const smallOld = '}).from(meetups).where(eq(meetups.visibility, \'public\'))';
        const smallNew = '}).from(meetups).where(and(eq(meetups.visibility, \'public\'), gte(meetups.date, new Date().toISOString().split(\'T\')[0])))';
        if (content.includes(smallOld)) {
            content = content.replace(smallOld, smallNew);
            fs.writeFileSync(path, content);
            console.log('Updated getPublicMeetups (Small match)');
        } else {
            console.log('Small pattern not found either');
        }
    }
}
