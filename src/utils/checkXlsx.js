import * as xlsx from 'js-xlsx';
import _ from 'lodash';

// 读取xlsx，校验等内容，目前未用

// 校验xls格式
export const getFileMimeType=(file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            try {
                let buffer = [...Buffer.from(event.target.result)];
                // 仅要文件的前四位就够了
                buffer = buffer.splice(0, 4);
                buffer.forEach((num, i, arr) => {
                    arr[i] = num.toString(16).padStart(2, '0');
                });
                // 504b0304 是 xlsx 的文件头,d0cf11e0 是xls的
                resolve(buffer.join('') === '504b0304'||buffer.join('') === 'd0cf11e0');
            } catch (e) {
                // 读取文件头出错 默认不是合法文件类型
                reject();
            }
        };
    });
}

function readXLSX(workbook){
    const sheetNames = workbook.SheetNames; // 工作表名称集合
    const sheet = sheetNames.map(el=>xlsx.utils.sheet_to_json(workbook.Sheets[el], { header: 1 }));
    return sheet;
  }
async function readWorkbook(workbook, resolve) {
    
    const [sheet0] = readXLSX(workbook);
    for (let i = 1; i < sheet0.length; i++) {  
      const insurance = sheet0[i];
      const insuranceCode = insurance[1];
      if (!insuranceCode) {
        // 检测某项必填用的，目前没开始
        break;
      }
  
      const key = sheet0[0];
  
      // 检测是否空行过多（超过10行即为过多）
      if((sheet0.filter(el=>el.every(val=>val===""||val===null))||[]).length>10){
        resolve({
          code: "500000",
          message: "sheet1空行过多，请清理过后再重新上传！"
        });
        return;
      }
  
    }
    resolve({
      code: "000000"
    });
    // onDone();
  
  
  }
export async function uploadExcelCheckFunc(f) {
    const {file, pageIndex} = f;
    console.log(pageIndex,'=pageIndex')
    return new Promise((resolve) => {
      if (/\.xlsx$/g.test(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: 'binary' });
          
          switch (pageIndex) {
            case 'step1Excel':
              //案件测试-资料上传
              readWorkbook(workbook, resolve);
              break;

            default:
              break
  
          }
        };
        reader.readAsBinaryString(file);
      } else {
        resolve({
          code: "500000",
          message: "文件不合法！"
        });
      }
  
    });
  
  
  }
  