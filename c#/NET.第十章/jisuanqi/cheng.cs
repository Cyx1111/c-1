using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
   public  class cheng:count
   {
       public int ji;
       public override int Calc()
       {
           ji = this.Right*this.Left;
           return ji;
       }
    }
}
