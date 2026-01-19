const axios = require('axios');

// 测试数据 - 使用已注册的用户名和邮箱
const testUser = {
  username: 'testuser_unique',
  password: 'testpassword',
  email: 'test_unique@example.com'
};

const testPrompt = {
  title: 'Test Prompt',
  content: 'This is a test prompt',
  category_id: 1,
  status: 1
};

async function runTest() {
  try {
    // 2. 登录获取token
    console.log('2. 用户登录...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: testUser.username,
      password: testUser.password
    });
    const token = loginResponse.data.token;
    console.log('用户登录成功，获取到token');

    // 3. 创建Prompt
    console.log('\n3. 创建Prompt...');
    const promptResponse = await axios.post('http://localhost:3001/prompts', testPrompt, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Prompt创建成功:', promptResponse.data);

    console.log('\n✅ 测试完成！创建Prompt时的外键约束错误已修复。');

  } catch (error) {
    console.error('❌ 测试失败:', error.response ? error.response.data : error.message);
    console.error('错误状态码:', error.response ? error.response.status : '无状态码');
    if (error.response && error.response.data) {
      console.error('错误详情:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

runTest();