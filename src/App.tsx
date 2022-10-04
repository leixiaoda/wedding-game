import React, { useState, useRef } from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import classNames from 'classnames';
import { NetworkStatus, DISTRACTORS, RIGHT_ANSWER } from './common/constant';
import './App.less';

function App() {
  const [status, setStatus] = useState(NetworkStatus.UNKNOWN);
  const [result, setResult] = useState('');
  let editorValue = useRef('public class WeddingGame {\n    public static void main(String []args) {\n        int[] array1 = new int[]{ 2312, 43, 875, 3486, 976, 468, 578, 70 };\n        int[] array2 = new int[]{ 125, 4326, 3721, 730, 2175, 2865, 1599 };\n        System.out.println("Hello World");\n    }\n}');

  const sendRequest = (code: string) => {
    const body = new URLSearchParams();
    body.set('code', code);
    body.set('fileext', 'java');
    body.set('language', '8');
    body.set('stdin', '');
    body.set('token', '4381fe197827ec87cbac9552f14ec62a');
    
    setStatus(NetworkStatus.PENDING);
    fetch('/compile2.php', {
      method: 'POST',
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res =>res.json()).then(res => {
      const { output, errors } = res;
      if (errors && errors.length > 4) { // errors will be '\n\n' with expected result
        setStatus(NetworkStatus.ERROR);
        setResult(errors);
      } else {
        setStatus(NetworkStatus.FINISHED);
        setResult(output);
      }
    }).catch(error => {
      setResult(error.toString());
      setStatus(NetworkStatus.ERROR);
    });
  }

  const renderDesc = () => (
    <div className='desc'>
      <p>给定 array1、array2 两个数组，要求依次计算</p>
      <p>array1[0] - array2[0] + array1[1] - array2[1] + ...</p>
      <p>注意：</p>
      <p>1. 减 array2[n] 时，若结果小于 0，则跳过该数字，即: array1[n - 1] + array1[n + 1]</p>
      <p>2. 两个数组长度不一定相同，均遍历完为结束</p>
    </div>
  );

  const onEditorChange = (newValue: string) => {
    editorValue.current = newValue;
  }

  const renderEditor = () => {
    return (
      <MonacoEditor
        className='editor'
        height="500px"
        language="java"
        value={editorValue.current}
        options={{
          fontSize: 15,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: false,
          theme: 'vs-dark',
          scrollbar: {
            useShadows: true,
            vertical: 'auto',
            horizontal: 'auto',
          },
        }}
        onChange={onEditorChange}
      />
    );
  };

  const handleClickCommitBtn = () => {
    sendRequest(editorValue.current);
  };

  const renderConsoleContent = () => {
    let customStr = 'I LOVE ';
    if (result === `${RIGHT_ANSWER}\n`) {
      customStr += 'Yi AnChao!';
    } else {
      customStr += DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)] + '!';
    }
    return (
      <div className="console--content">
        {status !== NetworkStatus.PENDING && (
          <div className={classNames('output', {
            isError: status === NetworkStatus.ERROR,
          })}>
            {result}
          </div>
        )}
        {status === NetworkStatus.FINISHED && <div className="custom">{customStr}</div>}
      </div>
    );
  };

  const renderConsole = () => {
    const isPending = status === NetworkStatus.PENDING;
    return (
      <div className='console'>
        <button
          className='commit-btn'
          onClick={handleClickCommitBtn}
          disabled={isPending}
        >
          {isPending ? '爱意检测中...' : '▶ 提交你的爱'}
        </button>
        {renderConsoleContent()}
      </div>
    )
  };

  return (
    <div className="App">
      {renderDesc()}
      <div className='divider' />
      {renderEditor()}
      <div className='divider' />
      {renderConsole()}
    </div>
  );
}

export default App;
