import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    startDate: +Mock.Random.time('T'),
    endDate: +Mock.Random.time('T'),
    updateTime: +Mock.Random.date('T'),
    exeTime: +Mock.Random.time('T'),
    jobName: /P_SEITL_TASK_[A-Z]{3}_[A-Z]{1}/,
    scriptName: /P_SEITL_SRIPT_[A-Z]{3}_[A-Z]{1}/,
    'author|1': ['ROOT','ADMIN','DEVELOP'],
    groupId: '@integer(1,5)',
    groupName: /[A-Z]{3}_[A-Z]{1}_TASK/,
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
    jobName: /P_SEITL_TASK_[A-Z]{3}_[A-Z]{1}/,
    'author|1': ['ROOT','ADMIN','DEVELOP'],
    'status|1': ['Success', 'Running', 'Falled', 'Waiting'],
    pageviews: '@integer(300, 5000)'
  }));
}

export default {
  getList: config => {
    const { type, jobName, author, page, limit, sort } = config.params;
    let mockList = List.filter(item => {
      // if (importance && item.importance !== importance) return false;
      // if (type && item.type !== type) return false;
      if (jobName && item.jobName.toUpperCase().indexOf(jobName.toUpperCase()) < 0) return false;
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
  },
  getSubList: config => {
    const { type, jobName, author, page, limit, sort } = config.params;
    let mockList = subList.filter(item => {
      if (jobName && item.jobName.toUpperCase().indexOf(jobName.toUpperCase()) < 0) return false;
      if (author && item.author.toUpperCase().indexOf(author.toUpperCase()) < 0) return false;
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
  }
};
