import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.less';

function App() {
  useEffect(() => {
    const code = 'public class HelloWorld { public static void main(String []args) { System.out.println("Hello Wo333rld!"); } }'

    const body = new URLSearchParams();
    body.set('code', code);
    body.set('fileext', 'java');
    body.set('language', '8');
    body.set('stdin', '');
    body.set('token', '4381fe197827ec87cbac9552f14ec62a');
    const response = fetch('/compile2.php', {
      method: 'POST',
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors',
    }).then(res => res.json());
    console.log('dada: ', response);
  });

  const renderCompiler = () => {
    return (
      <iframe
        className='iframe'
        src='https://tool.lu/coderunner/'
      />
    );
  }

  return (
    <div className="App">
      {/* {renderCompiler()} */}
    </div>
  );
}

export default App;
