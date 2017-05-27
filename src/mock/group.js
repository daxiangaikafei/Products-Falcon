import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    groupName: /[A-Z]{3}_[A-Z]{1}_TASK/,    
    createDate: +Mock.Random.time('T'),
    loseDate: +Mock.Random.time('T'),
    updateTime: +Mock.Random.date('T'),
    'author|1': ['ROOT','ADMIN','DEVELOP'],
    'status|1': ['Success', 'Running', 'Falled', 'Waiting'],
    'db|1': ['SSA','SOR','DPA','DM'],
    'groupDesc': Mock.Random.paragraph(1,2),
    pageviews: '@integer(300, 5000)'
  }));
}

export default {
  getList: config => {
    const { type, groupName, author, page, limit, sort } = config.params;
    let mockList = List.filter(item => {
      if (groupName && item.groupName.toUpperCase().indexOf(groupName.toUpperCase()) < 0) return false;
      if (author && item.author.toUpperCase().indexOf(author.toUpperCase()) < 0) return false;
      return true;
    });
    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

    return new Promise(resolve => {
      setTimeout(() => {
        resolve([200, {
          total: mockList.length,
          items: pageList
        }]);
      }, 300);
    })
  }
};
