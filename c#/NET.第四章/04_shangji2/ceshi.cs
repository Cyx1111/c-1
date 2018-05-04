using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _04_shangji2
{
    class ceshi
    {
        public static void Pay(pm p) {
            int money = p.Jmoney +p. Xiang +p. Fen;
            Console.WriteLine("项目经理;{0}基本工资{1}项目奖金{2}考核工资{3}合计{4}",p.Name,p.Jmoney,p.Xiang,p.Fen,money);
        }
        public static void Pay(se s)
        {
            int money = s.Money + s.Kao;
            Console.WriteLine("程序员;{0}基本工资{1}考核工资{2}合计{3}", s.Name,s.Money,s.Kao, money);
        }
    }
}
