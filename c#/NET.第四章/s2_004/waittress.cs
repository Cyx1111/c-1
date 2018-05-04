using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace s2_004
{
    class waittress
    {
        private Order o;
        //记录客人点餐
        public void GetOrder(Order o) {
            this.o = o;
        }
        //向厨师提供菜单
        public void SendOrder(chef ch) {
            Console.WriteLine("服务员将菜{0}传给厨师",o.meallist);
            ch.GetOrder(o);
        }
          //向厨师传菜
        public void transcook() {
            Console.WriteLine("服务员将菜{0}送给客户{1}！",o.meallist,o.id);
            o.customer.eat();
        }
    }
}
