import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createTime: +Mock.Random.time('T'),
    startDate: +Mock.Random.time('T'),
    endDate: +Mock.Random.time('T'),
    updateTime: +Mock.Random.date('T'),
    exeTime: +Mock.Random.time('T'),
    name: /P_SEITL_TASK_[A-Z]{3}_[A-Z]{1}/,
    scriptName: /P_SEITL_SRIPT_[A-Z]{3}_[A-Z]{1}/,
    'operator|1': ['ROOT','ADMIN','DEVELOP'],
    groupId: '@integer(1,5)',
    ownerProjectName: /[A-Z]{3}_[A-Z]{1}_TASK/,
    'status|1': ['Success', 'Running', 'Falled', 'Waiting'],
    'cycle|1': ['daily','once','weekly','monthly','yearly','hourly'],
    'db|1': ['SSA','SOR','DPA','DM'],
    'depend|1-4': ['@first'],
    pageviews: '@integer(300, 5000)'
  }));
}

const subList = [];
const subCount = 100;

for (let i = 0; i < subCount; i++) {
  subList.push(Mock.mock({
    id: '@increment',
    startTime: +Mock.Random.time('T'),
    endTime: +Mock.Random.time('T'),
    updateTime: +Mock.Random.date('T'),
    exeDuration: +Mock.Random.time('T'),
    'durations|7': ['@natural(9,99)'],
    'dates|7': ["@date('yyyy.MM.dd')"],
    name: /P_SEITL_TASK_[A-Z]{3}_[A-Z]{1}/,
    'author|1': ['ROOT','ADMIN','DEVELOP'],
    'status|1': ['Success', 'Running', 'Falled', 'Waiting'],
    pageviews: '@integer(300, 5000)'
  }));
}

export default {
  getList: config => {
    const { page, rows, keyword } = JSON.parse(config.data);
    let mockList = List.filter(item => {
      // if (importance && item.importance !== importance) return false;
      // if (type && item.type !== type) return false;
      if (keyword && (item.name.toUpperCase().indexOf(keyword.toUpperCase()) < 0 && item.author.toUpperCase().indexOf(keyword.toUpperCase()) < 0)) return false;
      // if (name && item.name.toUpperCase().indexOf(name.toUpperCase()) < 0) return false;
      // if (author && item.author.toUpperCase().indexOf(author.toUpperCase()) < 0) return false;
      return true;
    });
    // if (sort === '-id') {
    //   mockList = mockList.reverse()
    // }

    const pageList = mockList.filter((item, index) => index < rows * page && index >= rows * (page - 1));
    const result = {
          "code": 0,
          "data": {
            "pageCount": 10,
            "pageIndex": page,
            "pageSize": rows,
            "rows": pageList,
            "total": mockList.length
          },
          "message": "",
          "success": true
        }
    return new Promise(resolve => {
      resolve([200, result]);
    })
  },
  getSubList: config => {
    const { jobName, author, page, limit, sort, searchStr } = JSON.parse(config.data);
    let mockList = subList.filter(item => {
        if (searchStr && (item.jobName.toUpperCase().indexOf(searchStr.toUpperCase()) < 0 && item.author.toUpperCase().indexOf(searchStr.toUpperCase()) < 0)) return false;
      return true;
    });

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

    return new Promise(resolve => {
      setTimeout(() => {
        resolve([200, {
          total: mockList.length,
          items: pageList
        }]);
      }, 300);
    })
  },

  saveOrUpdate: config => {
    const form = JSON.parse(config.data)
    return new Promise(resolve => {
      console.log(form)
      resolve([200, {
        success: true,
        message: ''
      }])
    })
  },

  runOrStop: config => {
    const data = JSON.parse(config.data)
    return new Promise(resolve => {
      console.log(data)
      resolve([200, {
        success: true,
        message: ''
      }])
    })
  },

  delete: config => {
    const data = JSON.parse(config.data)
    return new Promise(resolve => {
      console.log(data)
      resolve([200, {
        success: true,
        message: ''
      }])
    })
  }
};
