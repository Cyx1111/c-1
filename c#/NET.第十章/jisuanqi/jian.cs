using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
   public  class jian:count
   {
       public int cha;
       public override int Calc()
       {
           cha = this.Left + this.Right;
           return cha;
       }
    }
}
