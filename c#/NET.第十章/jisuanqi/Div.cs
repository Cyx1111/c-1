using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
   public  class Div:count
    {
       public override int Calc()
       {
           if(Right==0)
           {
               throw new Exception("除数不能为0");
           }
           else
           {
               return this.Left/this.Right;
           }
       }
    }
}
