using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _04_shangji1
{
    class Program
    {
        static void Main(string[] args)
        {
            SE se = new SE("112","小一",22,"男",100);
            Console.WriteLine("工号是：{0}姓名是：{1}年龄：{2}性别：{3}分数：{4}", se.Id, se.Name, se.Age, se.Sex, se.Wh);

           PM pm = new PM("112", "小一", 22, "男", 100);
           Console.WriteLine("工号是：{0}姓名是：{1}年龄：{2}性别：{3}分数：{4}", pm.Id, pm.Name, pm.Age, pm.Sex, pm.Wh);
           Console.ReadLine();
        }
    }
}
