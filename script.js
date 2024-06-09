async function fetchComments(page) {
  const response = await fetch(`https://bjapi.afreecatv.com/api/moolchoco/title/126972041/comment?page=${page}`).json();
  return response.json();
}

async function getAllComments() {
  let data = await fetchComments(1);
  let totalComments = data.comment_count;
  const totalPages = data.meta.last_page;

  let allComments = extractData(data.data);
  for (let page = 2; page <= totalPages; page++) {
    data = await fetchComments(page);
    totalComments += data.data.length;
    allComments = allComments.concat(extractData(data.data));
  }
  allComments.sort((a, b) => {
    if (b.like_cnt !== a.like_cnt) {
      return b.like_cnt - a.like_cnt;
    } else {
      return new Date(a.reg_date) - new Date(b.reg_date);
    }
  });

  displayComments(allComments);
  document.getElementById('totalComments').innerText = `총 댓글 수: ${totalComments}`;
}

function extractData(data) {
  return data.map(item => {
    const splitComments = item.comment.split('/');
    let secondComment = '';
    if (splitComments.length > 1) {
      const secondComments = splitComments[1].trim();
      const splitSecondComments = secondComments.split(' ')[0];
      secondComment = splitSecondComments
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .trim();
    }
    return {
      user_nick: item.user_nick,
      user_id: item.user_id,
      like_cnt: item.like_cnt,
      mc_id: secondComment,
      reg_date: new Date(item.reg_date),
    };
  });
}

function displayComments(comments) {
  let table = `<table>
        <tr>
            <th>순위</th>
            <th>닉네임</th>
            <th>마크 아이디</th>
            <th>아프리카 아이디</th>
            <th>UP</th>
        </tr>`;

  comments.forEach((comment, index) => {
    table += `<tr>
            <td>${index + 1}</td>
            <td>${comment.user_nick}</td>
            <td>${comment.mc_id}</td>
            <td>${comment.user_id}</td>
            <td>${comment.like_cnt}</td>
        </tr>`;
  });
  table += `</table>`;

  document.getElementById('commentsTable').innerHTML = table;
}
getAllComments();
