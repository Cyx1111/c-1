using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace 序列化0
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Class1> list = new List<Class1>();
            Class1 p = new Class1();
            p.Age = 12;
            p.Name = "小二";

            Class1 p1 = new Class1();
            p1.Age = 10;
            p1.Name = "小一";

            list.Add(p1);
            list.Add(p);

            //BinaryFormatter bf = new BinaryFormatter();
            //FileStream fs = new FileStream("文件夹.txt", FileMode.Create);
            //bf.Serialize(fs, list);
            //fs.Close();
            //Console.WriteLine(" 成功");
            //Console.ReadKey();



            BinaryFormatter bf = new BinaryFormatter();
            FileStream fs = new FileStream("文件夹.txt", FileMode.Open);
            List<Class1> list1 = (List<Class1>)bf.Deserialize(fs);
            foreach (Class1 item in list1)
            {
                Console.WriteLine(item.Name);
            }
            Console.ReadKey();
  


        }
    }
}
