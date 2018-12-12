 $(document).ready(function(){  
      var i=1;  
      var limit=10;
      $('#add').click(function(){  
        
          // console.log(i);
           if(i<limit){  
           $('#dynamic_field').append('<tr id="row'+i+'"><td><input type="text" placeholder="Enter Category" class="form-control name_list" name="category"></td><td><input type="text" placeholder="Enter Attributes " class="form-control name_list" name="attributes"></td><td><button type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">X</button></td></tr>');  
               i++;
        }
      }); 
      var j=1; 
      $('#add_c').click(function(){
          
          console.log()
          if(j<limit){
            j++;
             var k=10+j;
           $('#dynamic_field_c').append('<tr id="row'+k+'"><td><input type="text" name="name" placeholder="Enter your item" class="form-control name_list" /></td><td><input type="text" placeholder="Enter Attributes " class="form-control name_list" name="attributes"></td> <td><button type="button" name="remove" id="'+k+'" class="btn btn-danger btn_remove">X</button></td></tr>');  
          }
      });
      $(document).on('click', '.btn_remove', function(){
           var button_id = $(this).attr("id"); 
           if(button_id>10) j--;
           else i--;  
           $('#row'+button_id+'').remove();  
          //  console.log(i);
      });

      function myFunction() {
          var form=$("#dynamic_field").closest('form')
          $(form.prop('elements')).each(function(){
              var missing= $(this).val()===""
              $(this).parent().toggleClass('error',missing)
          })
          return 0;
      }
      $("#submit").click(function(){
        if(myFunction())
        $("#add_name").submit();
      })
      $("#submit_c").click(function(){
        $("#add_name_c").submit();
      })
      /*
      $('#submit').click(function(){            
           $.ajax({  
                url:"name.php",  
                method:"POST",  
                data:$('#add_name').serialize(),  
                success:function(data)  
                {  
                     alert(data);  
                     $('#add_name')[0].reset();  
                }  
           });  
      });
      */  
 });  