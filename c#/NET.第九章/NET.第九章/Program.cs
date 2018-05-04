using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.第九章
{
    class Program
    {
        private static void Main(string[] args)
        {
            //WriteToFile();
            Read();
        }

        private static void WriteToFile()
            {
                FileStream fs = new FileStream("F:\\晚自习.txt", FileMode.Append);
            StreamWriter sw=new StreamWriter(fs,Encoding.UTF8);
            sw.WriteLine("明天有课");
            sw.Close();
            fs.Close();
            Console.WriteLine("恭喜成功啦");
            Console.ReadKey();

            }


        private static void Read()
        {
            FileStream fs=new FileStream("F:\\晚自习.txt",FileMode.Open);
            StreamReader sr=new StreamReader(fs,Encoding.Default);
            string words = sr.ReadToEnd();
            Console.WriteLine(words);
            sr.Close();
            fs.Close();
            Console.WriteLine("成功");
            Console.ReadKey();
        }
        }
    }

