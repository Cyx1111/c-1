using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace NET_day03
{
    class Program
    {
        static void Main(string[] args)
        {
            //ArrayList list = new ArrayList();
            //list.Add("大厨 * 骚猪");
            //list.Add("大厨 * 黑猪");
            //list.Add("大厨 * 白猪");
            //list.Add("大厨 * 卤猪");
          
            //foreach (var item in list)
            //{
            //    Console.WriteLine(item);
            //}
            ////删除
            //list.Remove("大厨 * 黑猪");
            ////修改
            //list[1] = "吃猪肉吗";
            //foreach (var item in list)
            //{
            //    Console.WriteLine(item);
            //    Console.WriteLine("********************************");
            //}




            Dictionary<string, SE> dic = new Dictionary<string,SE>();
                                        
            SE se = new SE();
            se.Bookname = "活着";
            se.Bookjia = 11;
            SE se1 = new SE();
            se1.Bookname = "朝花夕拾";
            se1.Bookjia = 10;
            dic.Add(se.Bookname,se);
            dic.Add(se1.Bookname,se1);

            foreach (string key in dic.Keys)
            {
                Console.WriteLine(key+ "\t" + dic[key]);
            }
            Console.WriteLine("--------------------------------------");
            foreach(SE value in dic.Values)
            {
                Console.WriteLine(value.Bookname);
            
            }

            Console.ReadLine();
        }
        public void show() {
            //ArrayList list = new ArrayList()
            //{
            //   new book(){bookname="活着"},
            //   new book(){bookname="嘻嘻"},
         
            //};
            Hashtable table = new Hashtable();
            table.Add("cbc","中国建设");
            table.Add("abc","中国农行");
            table.Add("icbc","中国工行");
            foreach (DictionaryEntry item in table )
            {
                Console.WriteLine();
            }
        
   

        }
    }
}
