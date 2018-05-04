using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _04_shangji2
{
    class Program
    {
        static void Main(string[] args)
        {
            pm p = new pm();
            p.Name = "嘻哈";
            p.Jmoney=10000;
            p.Xiang=1200;
            p.Fen = 100;
            se s = new se();
            s.Name = "丝丝";
            s.Kao = 2000;
            s.Money = 5000;

            ceshi.Pay(s);
            ceshi.Pay(p);
            Console.ReadLine();
        
        
        
        
        
        }
         
    }
}
