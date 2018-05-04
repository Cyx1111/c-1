using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter15
{
    class Program
    {
        static void Main(string[] args)
        {
            //    string con ;
        //    Console.WriteLine("==============低碳生活计算公式==============");
        //    Console.WriteLine("省一度电，就减少0.638千克的碳排放");
        //    Console.WriteLine("省一升水，就减少0.194千克的碳排放");
        //    Console.WriteLine("省一度天然气，就减少2.1千克的碳排放");
        //    Console.WriteLine("============================================");
        //    do
        //    {
        //        Console.WriteLine("请输入你每天的用电量");
        //        double dian = Convert.ToDouble(Console.ReadLine());
        //        Console.WriteLine("请输入你每天的用水量");
        //        double shui = Convert.ToDouble(Console.ReadLine());
        //        Console.WriteLine("请输入你每天的天然气量");
        //        double qi = Convert.ToDouble(Console.ReadLine());
        //        double zong = dian * 0.638 + shui * 0.194 + qi * 2.1;
        //        Console.WriteLine("你每天生活将会产生碳排放量是"+ string.Format("{0:F2}",zong)+"千克");
        //        Console.WriteLine("希望你继续努力，降低碳排放量！");
        //        Console.WriteLine("继续输入码？y/n");
        //         con = Console.ReadLine();
        //    }
        //    while (con.Equals("y"));
        //    Console.WriteLine("感谢你的使用");
            live();
        }



        public static void live()
        {
              String choose;
            string pan;
            string[] kemu = new string[] { "1度电", "1升水", "1度天然气" };
            double[] liang1 = new double[] { 0.638, 0.194, 2.1 };
            double[] liang = new double[kemu.Length];
            do
            {
                 double sum=0;
            Console.WriteLine("=============低碳生活计算公式=============");
            for (int i = 0; i < kemu.Length; i++)
            {
                Console.WriteLine("省{0}，就减少{1}千克的碳排放",kemu[i],liang1[i]);
            }
            Console.WriteLine("==========================================");
            Console.WriteLine("请输入每天的用电量：");
            liang[0] = double.Parse(Console.ReadLine());
            Console.WriteLine("请输入每天的用水量：");
            liang[1] = double.Parse(Console.ReadLine());
            Console.WriteLine("请输入每天的用天然气量：");
            liang[2] = double.Parse(Console.ReadLine());
            for (int i = 0; i < kemu.Length; i++)
            {
                sum += liang1[i] * liang[i];
            }
            Console.WriteLine("你每天生活将会产生碳排放量是：{0}千克", Math.Round(sum, 2));
            Console.WriteLine("希望你继续努力，降低碳排量！");
            Console.WriteLine("");
            Console.WriteLine("继续输入吗？(y/n)");
            choose = Console.ReadLine();
            } while (choose.Equals("y"));
           
            Console.ReadLine();

            }


        }
    }

