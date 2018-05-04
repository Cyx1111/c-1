using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace s2_004
{
    class chef
    {
        private Order o;//获得菜单
        public void GetOrder(Order o) {
            this.o = o;
        }
        //厨师做菜
        public void cook(){
            Console.WriteLine("厨师烹饪：{0}",o.meallist);
            Console.WriteLine("制作完毕");
         }
        public void SendAlert( waittress w){
            Console.WriteLine("厨师提示服务员取菜");
            w.GetOrder(o);
        }






    }
}
