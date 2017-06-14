import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: /[A-Z]{3}_[A-Z]{1}_TASK/,    
    createTime: Mock.Random.date(),
    beginDate: +Mock.Random.time('T'),
    endDate: Mock.Random.date(),
    updateTime: +Mock.Random.date('T'),
    'operator|1': ['ROOT','ADMIN','DEVELOP'],
    'status|1': ['Success', 'Running', 'Falled', 'Waiting'],
    'dataLevel|1': ['SSA','SOR','DPA','DM'],
    'descripe': Mock.Random.paragraph(1,2),
    pageviews: '@integer(300, 5000)'
  }));
}

export default {
  getList: config => {
    const { page, rows, keyword } = JSON.parse(config.data);
    let mockList = List.filter(item => {
        if (keyword && (item.name.toUpperCase().indexOf(keyword.toUpperCase()) < 0 && item.operator.toUpperCase().indexOf(keyword.toUpperCase()) < 0)) return false;
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
      setTimeout(() => {
        resolve([200, result]);
      }, 300);
    })
  },

  saveOrUpdate: config => {
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
