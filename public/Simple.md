# Get2C Simplificado

## Setup

### Atividades económicas

- Secção
  
- CAE
  
- Atividade económica
  
- Sector
  
    - Primário
      
    - Secundário
      
    - Terciário
      
- Emissões/€ (média)
  
- Percentagem da iluminação no consumo energético [PIC]
  
### Empresas

- Nome da empresa
  
- País
  
- Número de Identificação Fiscal
  
- Portugal
  
    - Município
      
        - Lista nacional de municípios.
          
- Atividade económica
  
- O transporte de mercadorias (compras e/ou vendas) é relevante?
  <!-- ::xmind-pos:{"x":-12470,"y":503} -->
  
- Número de trabalhadores
  
- Regime de funcionamento
  
    - Dias por ano [DA]
      
    - Horas por dia
      
- Volume de negócio
  
- Sector
  
    - Primário
      
        - Área agrícola
          
    - Secundário ou terciário
      
        - Área do negócio
          
- Secção
  
    - B
      
        - Extração
          
    - C
      
        - Produção
          
        - Unidade
          
            - t
              
            - m3
              
            - L
              
            - Unidades
              
    - D
      
        - Produção
          
        - Unidade
          
            - MWh
              
            - m3
              
    - E
      
        - CAE
          
            - 36 e 37
              
                - Volume de água
                  
            - 38
              
                - Resíduos
                  
- Nova empresa
  
## Recolha, cálculo e resultados

### Empresa em análise

### Ano em análise

### Recolha mensal ou anual?

- Mensal
  
    - Mês em análise
      
- Anual
  
    - Tem dados de auditoria energética
      
### Categorias

- Transporte
  
    - Pessoas
      
        - Frota
          
            - Get2C
              
                - Tipo de combustível
                  
                - Usar este combustível para mitigação
                  
                    - O combustível que tiver este campo selecionado é o que será usado para os cálculos de mitigação.
                      
                    - Esta checkbox só pode estar activa num dos combustíveis.
                      
                - Unidade [U]
                  
                    - m3
                      
                    - kg
                      
                    - L
                      
                    - kWh
                      
                - PCI por volume
                  
                    - Fonte da informação
                      
                - PCI por massa
                  
                    - Fonte da informação
                      
                - Densidade
                  
                    - Fonte da informação
                      
                - Por {U} [P]
                  <!-- ::xmind-pos:{"x":-12289,"y":1650} -->
                  
                    - Fonte da informação
                      
                - Fator de emissão [FE]
                  
                    - Fonte da informação
                      
                - Well-to-tank [FE_WTT]
                  
                    - Fonte da informação
                      
                - Novo combustível
                  
            - Cliente
              
                - Tipos de combustível consumidos
                  
                - Número de veículos
                  
                - Consumo em € ou quantidade adquirida?
                  
                    - €
                      
                        - Custo [C]
                          
                        - Energia [GJ]
                          
                          $$
                          = ( \frac{c}{p} ) \times
                          \begin{cases}
                          pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                          pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                          d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                          0.0036, & \mbox{se }u\mbox{ for } kWh \\
                          \end{cases}
                          $$
                        - Emissões [E]
                          
                          $$
                          = gj \times FE \div 1000
                          $$
                            - Unidade
                              
                                - m3 ou kg ou L
                                  
                                    - A1
                                      
                                - kWh
                                  
                                    - A2
                                      
                        - Emissões Well-to-Tank
                          
                          $$
                          = gj \times FE_{wtt} \div 1000
                          $$
                            - A3,C3
                              
                        - Emissões poupadas
                          
                          $$
                          = e - (gj \times FE_{mitigacao} \div 1000)
                          $$
                            - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                              
                        - Poupanças
                          
                          $$
                          = c-(gj \div
                          \begin{cases}
                          pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                          pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                          d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                          0.0036, & \mbox{se }u\mbox{ for } kWh \\
                          
                          \end{cases}
                          \times p_{mitigacao})
                          $$
                            - P_mitigação corresponde ao preço do combustível escolhido para mitigação.
                              
                            - Deve ser usada a variável correspondente à unidade do combustível escolhido para mitigação.
                              
                    - Quantidade adquirida
                      
                        - Quantidade [Q]
                          
                        - Energia [GJ]
                          
                          $$
                          = q \times
                          \begin{cases}
                          pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                          pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                          d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                          0.0036, & \mbox{se }u\mbox{ for } kWh \\
                          \end{cases}
                          $$
                        - Emissões [E]
                          
                          $$
                          = gj \times FE \div 1000
                          $$
                            - Unidade
                              
                                - m3 ou kg ou L
                                  
                                    - A1
                                      
                                - kWh
                                  
                                    - A2
                                      
                        - Emissões Well-to-Tank
                          
                          $$
                          = gj \times FE_{wtt} \div 1000
                          $$
                            - A3,C3
                              
                        - Custo
                          
                          $$
                          = q \times p
                          $$
                        - Emissões poupadas
                          
                          $$
                          = e - (gj \times FE_{mitigacao} \div 1000)
                          $$
                            - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                              
                        - Poupanças
                          
                          $$
                          = c-(gj \div
                          \begin{cases}
                          pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                          pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                          d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                          0.0036, & \mbox{se }u\mbox{ for } kWh \\
                          \end{cases}
                          \times p_{mitigacao})
                          $$
                            - P_mitigação corresponde ao preço do combustível escolhido para mitigação.
                              
                            - Deve ser usada a variável correspondente à unidade do combustível escolhido para mitigação.
                              
        - Viagens de negócios
          
            - Get2C
              
                - Veículos alugados
                  
                    - Tipo de veículo
                      
                    - Usar este tipo de veículo para mitigação
                      
                        - Esta checkbox só pode estar activa num dos tipos de veículo.
                          
                    - Fator de emissão [FE]
                      
                        - Fonte da informação
                          
                    - Novo veículo alugado
                      
                - Transportes públicos
                  
                    - Transporte
                      
                    - Fator de emissão [FE]
                      
                        - Fonte da informação
                          
                    - Novo transporte público
                      
                - Voos
                  
                    - Duração
                      
                    - Distância percorrida (média) [D]
                      
                        - Fonte da informação
                          
                    - Fator de emissão [FE]
                      
                        - Fonte da informação
                          
                    - Custo (média) [C]
                      
                        - Fonte da informação
                          
                    - Novo tipo de voo
                      
            - Cliente
              
                - Veículos alugados
                  
                    - Tipo de veículo
                      
                    - Km percorridos (média) [D]
                      
                    - Emissões [E]
                      
                      $$
                      = d \times FE \div 1000
                      $$
                        - A3,C7
                          
                    - Emissões poupadas
                      
                      $$
                      = e - (d \times FE_{mitigacao} \div 1000)
                      $$
                        - FE_mitigação corresponde ao FE do tipo de veículo escolhido para mitigação.
                          
                - Transportes públicos
                  
                    - Transportes públicos utilizados
                      
                    - Km percorridos (média) [D]
                      
                    - Emissões
                      
                      $$
                      = d \times FE \div 1000
                      $$
                        - A3,C7
                          
                - Voos
                  
                    - Duração do voo
                      
                    - Número de voos [Q]
                      
                    - Emissões [E]
                      
                      $$
                      = q \times d \times FE \div 1000
                      $$
                        - A3,C6
                          
                    - Emissões poupadas
                      
                      $$
                      = e
                      $$
                    - Poupanças
                      
                      $$
                      = c
                      $$
        - Casa-trabalho-casa
          
            - Get2C
              
                - Veículos próprios
                  
                    - Combustível
                      
                    - Fator de emissão [FE]
                      
                        - Fonte da informação
                          
                    - Novo combustível
                      
                - Transportes públicos
                  
                    - Transporte
                      
                    - Fator de emissão [FE]
                      
                        - Fonte da informação
                          
                    - Novo transporte público
                      
            - Cliente
              
                - Veículos próprios
                  
                    - Combustível
                      
                    - Número de pessoas [Q]
                      
                    - Km percorridos por dia (média) [D]
                      
                    - Recolha
                      
                        - Mensal
                          
                            - Emissões
                              
                              $$
                              = q \times d \times ( \frac{da}{12} ) \times FE \div 1000
                              $$
                                - A3,C7
                                  
                        - Anual
                          
                            - Emissões
                              
                              $$
                              = q \times d \times da \times FE \div 1000
                              $$
                                - A3,C7
                                  
                - Transportes públicos
                  
                    - Transportes públicos utilizados
                      
                    - Número de pessoas [Q]
                      
                    - Km percorridos por dia (média) [D]
                      
                    - Recolha
                      
                        - Mensal
                          
                            - Emissões
                              
                              $$
                              = q \times d \times ( \frac{da}{12} ) \times FE \div 1000
                              $$
                                - A3,C7
                                  
                        - Anual
                          
                            - Emissões
                              
                              $$
                              = q \times d \times da \times FE \div 1000
                              $$
                                - A3,C7
                                  
    - Transporte de mercadorias relevante
      
        - Mercadorias
          
            - Get2C
              
                - Fator de emissão [FE]
                  
                    - Fonte da informação
                      
            - Cliente
              
                - Transporte de mercadorias compradas
                  
                    - Tipo de mercadoria
                      
                        - Lista de bens ou serviços dentro das compras.
                          
                    - Distância média [D]
                      
                    - Peso médio [P]
                      
                    - Emissões
                      
                      $$
                      = d \times p \times FE \div 1000000
                      $$
                        - A3,C4
                          
                    - Novo tipo de mercadoria
                      
                - Transporte de mercadorias vendidas
                  
                    - Tipo de mercadoria
                      
                        - Lista de bens ou serviços dentro das compras.
                          
                    - Distância média [D]
                      
                    - Peso médio [P]
                      
                    - Emissões
                      
                      $$
                      = d \times p \times FE \div 1000000
                      $$
                        - A3,C9
                          
                    - Novo tipo de mercadoria
                      
- Edifícios
  
    - Combustíveis
      
        - Get2C
          
            - Tipo de combustível
              
            - Usar este combustível para mitigação
              
                - O combustível que tiver este campo selecionado é o que será usado para os cálculos de mitigação.
                  
                - Esta checkbox só pode estar activa num dos combustíveis.
                  
            - Unidade [U]
              
                - m3
                  
                - kg
                  
                - L
                  
            - PCI por volume
              
                - Fonte da informação
                  
            - PCI por massa
              
                - Fonte da informação
                  
            - Densidade
              
                - Fonte da informação
                  
            - Por {U} [P]
              <!-- ::xmind-pos:{"x":-12289,"y":1650} -->
              
                - Fonte da informação
                  
            - Por kWh [P_kWh]
              <!-- ::xmind-pos:{"x":-12289,"y":1650} -->
              
                - Fonte da informação
                  
            - Fator de emissão [FE]
              
                - Fonte da informação
                  
            - Well-to-tank [FE_WTT]
              
                - Fonte da informação
                  
            - Novo combustível
              
        - Cliente
          
            - Tipos de combustível consumidos
              
            - Tem dados de auditoria energética?
              
                - Não
                  
                    - Consumo em € ou quantidade adquirida?
                      
                        - €
                          
                            - Custo [C]
                              
                            - Energia [GJ]
                              
                              $$
                              = ( \frac{c}{p} ) \times
                              \begin{cases}
                              pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                              pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                              d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                              \end{cases}
                              $$
                            - Emissões [E]
                              
                              $$
                              = gj \times FE \div 1000
                              $$
                                - A1
                                  
                            - Emissões Well-to-Tank
                              
                              $$
                              = gj \times FE_{wtt} \div 1000
                              $$
                                - A3,C3
                                  
                            - Emissões poupadas
                              
                              $$
                              = e - (gj \times FE_{mitigacao} \div 1000)
                              $$
                                - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                                  
                            - Poupanças
                              
                              $$
                              = c-(gj \div
                              \begin{cases}
                              pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                              pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                              d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                              \end{cases}
                              \times p_{mitigacao})
                              $$
                                - P_mitigação corresponde ao preço do combustível escolhido para mitigação.
                                  
                                - Deve ser usada a variável correspondente à unidade do combustível escolhido para mitigação.
                                  
                        - Quantidade adquirida
                          
                            - Quantidade [Q]
                              
                            - Energia [GJ]
                              
                              $$
                              = q \times
                              \begin{cases}
                              pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                              pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                              d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                              \end{cases}
                              $$
                            - Emissões [E]
                              
                              $$
                              = gj \times FE \div 1000
                              $$
                                - A1
                                  
                            - Emissões Well-to-Tank
                              
                              $$
                              = gj \times FE_{wtt} \div 1000
                              $$
                                - A3,C3
                                  
                            - Custo [C]
                              
                              $$
                              = q \times p
                              $$
                            - Emissões poupadas
                              
                              $$
                              = e - (gj \times FE_{mitigacao} \div 1000)
                              $$
                                - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                                  
                            - Poupanças
                              
                              $$
                              = c-(gj \div
                              \begin{cases}
                              pci_{volume}, & \mbox{se }u\mbox{ for } m^3 \\
                              pci_{massa} \div 1000, & \mbox{se }u\mbox{ for }kg \\
                              d \times pci_{massa}, & \mbox{se }u\mbox{ for } L \\
                              \end{cases}
                              \times p_{mitigacao})
                              $$
                                - P_mitigação corresponde ao preço do combustível escolhido para mitigação.
                                  
                                - Deve ser usada a variável correspondente à unidade do combustível escolhido para mitigação.
                                  
                - Sim
                  
                    - Climatização (aquecimento e arrefecimento)
                      
                        - Quantidade [Q]
                          
                    - Águas quentes sanitárias (AQS)
                      
                        - Quantidade [Q]
                          
                    - Cozinha/ refeitório
                      
                        - Quantidade [Q]
                          
                    - Cálculos para cada fonte de emissão
                      
                        - Emissões [E]
                          
                          $$
                          = q \times 0.0036 \times FE \div 1000
                          $$
                            - A1
                              
                        - Emissões well-to-tank [E_wtt]
                          
                          $$
                          = q \times 0.0036 \times FE_{wtt} \div 1000
                          $$
                            - A3,C3
                              
                        - Custo [C]
                          
                          $$
                          = q \times p_{kWh}
                          $$
                    - Consumo total
                      
                      $$
                      = \sum (q)
                      $$
                        - Mostrar abaixo da última fonte de emissão para o utilizador poder ver o somatório dos consumos por combustível.
                          
                    - Emissões totais
                      
                      $$
                      = \sum (e)
                      $$
                        - A1
                          
                    - Emissões well-to-tank totais
                      
                      $$
                      = \sum (e_{wtt})
                      $$
                        - A3,C3
                          
                    - Custo total
                      
                      $$
                      = \sum (c)
                      $$
                    - Emissões poupadas
                      
                      $$
                      = \sum (e) - (\sum (q) \times 0.0036 \times FE_{mitigacao} \div 1000)
                      $$
                        - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                          
                    - Poupanças
                      
                      $$
                      = \sum (c)-(\sum (q) \times p_{kWh_{mitigacao}})
                      $$
                        - P_kWh_mitigação corresponde ao preço do combustível escolhido para mitigação.
                          
    - Eletricidade
      
        - Get2C
          
            - Location
              
                - País
                  
                - Fator de emissão [FE_location]
                  
                    - Fonte da informação
                      
                - Novo país
                  
            - Market
              
                - País
                  
                - Fornecedor
                  
                - É um tarifário verde
                  
                - Preço anual (média) [P]
                  
                    - Fonte da informação
                      
                - Fator de emissão [FE_market]
                  
                    - Fonte da informação
                      
                - Novo fornecedor
                  
            - Well-to-tank
              
                - Fator de emissão [FE_WTT]
                  
                    - Fonte da informação
                      
            - Tipos de iluminação
              
                - Tipo de iluminação
                  
                - Potencial de redução [PR]
                  
                    - Fonte da informação
                      
                - Novo tipo de iluminação
                  
        - Cliente
          
            - Fornecedor
              
            - Tem dados de auditoria energética
              
                - Não
                  
                    - Consumo em € ou kWh?
                      
                        - €
                          
                            - Custo [C]
                              
                            - Emissões (market) [E_market]
                              
                              $$
                              = (\frac{c}{p}) \times FE_{market} \div 1000
                              $$
                                - A2
                                  
                            - Emissões (location)
                              
                              $$
                              = (\frac{c}{p}) \times FE_{location} \div 1000
                              $$
                                - A2
                                  
                            - Emissões Well-to-Tank
                              
                              $$
                              = (\frac{c}{p}) \times FE_{wtt} \div 1000
                              $$
                                - A3,C3
                                  
                        - kWh
                          
                            - Quantidade [Q]
                              
                            - Emissões (market) [E_market]
                              
                              $$
                              = q \times FE_{market} \div 1000
                              $$
                                - A2
                                  
                            - Emissões (location)
                              
                              $$
                              = q \times FE_{location} \div 1000
                              $$
                                - A2
                                  
                            - Emissões Well-to-Tank
                              
                              $$
                              = q \times FE_{wtt} \div 1000
                              $$
                                - A3,C3
                                  
                            - Custo
                              
                              $$
                              = q \times p
                              $$
                    - Tipo de iluminação
                      
                    - Quantidade desse tipo de iluminação [QI]
                      
                        - Não deixar o somatório dos diferentes tipos de iluminação ultrapassar 100%.
                          
                    - Emissões poupadas
                      
                      $$
                      = e_{market} \times pic \times pr \times qi
                      $$
                        - O PIC é obtido da atividade económica.
                          
                    - Economias
                      
                      $$
                      = e \times 1000 \div FE \times pic \times pr \times p \times qi
                      $$
                - Sim
                  
                    - Climatização (aquecimento e arrefecimento)
                      
                        - Quantidade [Q]
                          
                    - Águas quentes sanitárias (AQS)
                      
                        - Quantidade [Q]
                          
                    - Iluminação
                      
                        - Quantidade [Q]
                          
                    - Ventilação
                      
                        - Quantidade [Q]
                          
                    - Outros equipamentos
                      
                        - Quantidade [Q]
                          
                    - Cálculos para cada fonte de emissão
                      
                        - Emissões [E]
                          
                          $$
                          = q \times FE \div 1000
                          $$
                        - Emissões well-to-tank [E_wtt]
                          
                          $$
                          = q \times FE_{wtt} \div 1000
                          $$
                        - Custo [C]
                          
                          $$
                          = q \times p
                          $$
                    - Consumo total
                      
                      $$
                      = \sum (q)
                      $$
                        - Mostrar abaixo da última fonte de emissão para o utilizador poder ver o somatório dos consumos por combustível.
                          
                    - Emissões totais
                      
                      $$
                      = \sum (e)
                      $$
                    - Emissões well-to-tank totais
                      
                      $$
                      = \sum (e_{wtt})
                      $$
                    - Custo total
                      
                      $$
                      = \sum (c)
                      $$
    - Equipamentos com gases refrigerantes
      
        - Get2C
          
            - Tipo de equipamento
              
            - Carga (média) [C]
              
                - Fonte da informação
                  
            - GWP
              
                - Fonte da informação
                  
            - Perda por ano [P]
              
                - Fonte da informação
                  
            - Novo equipamento
              
        - Cliente
          
            - Tipos de equipamento existentes
              
            - Número de equipamentos [Q]
              
            - Recolha
              
                - Mensal
                  
                    - Emissões
                      
                      $$
                      = \frac{q \times c \times gwp \times p}{12} \div 1000
                      $$
                        - A1
                          
                - Anual
                  
                    - Emissões
                      
                      $$
                      = q \times c \times gwp \times p \div 1000
                      $$
                        - A1
                          
    - Água
      
        - Get2C
          
            - Preço anual (média) [P]
              
                - Fonte da informação
                  
            - Fator de emissão [FE]
              
                - Fonte da informação
                  
            - Redução de caudal [R]
              
                - Fonte da informação
                  
        - Cliente
          
            - Tem redutores de caudal instalados nas torneiras/chuveiros?
              <!-- ::xmind-pos:{"x":-5036,"y":772} -->
              
            - Consumo em € ou L?
              
                - €
                  
                    - Custo [C]
                      
                    - Emissões
                      
                      $$
                      = \frac{c}{p} \times FE \div 1000
                      $$
                        - A3,C1
                          
                - L
                  
                    - Quantidade [Q]
                      
                    - Emissões
                      
                      $$
                      = q \times FE \div 1000
                      $$
                        - A3,C1
                          
                    - Custo
                      
                      $$
                      = q \times p
                      $$
- Secção C a E e tem dados de auditoria energética
  
    - Produção
      
        - Combustíveis
          
            - Cliente
              
                - Tipo de combustível consumido
                  
                    - Usar os dados de FE e de custos dos combustíveis nos Edifícios.
                      
                - Central térmica
                  
                    - Quantidade [Q]
                      
                - Fornos
                  
                    - Quantidade [Q]
                      
                - Outros
                  
                    - Quantidade [Q]
                      
                - Cálculos para cada fonte de emissão
                  
                    - Emissões [E]
                      
                      $$
                      = q \times 0.0036 \times FE \div 1000
                      $$
                    - Emissões well-to-tank [E_wtt]
                      
                      $$
                      = q \times 0.0036 \times FE_{wtt} \div 1000
                      $$
                    - Custo [C]
                      
                      $$
                      = q \times p_{kWh}
                      $$
                - Consumo total
                  
                  $$
                  = \sum (q)
                  $$
                    - Mostrar abaixo da última fonte de emissão para o utilizador poder ver o somatório dos consumos por combustível.
                      
                - Emissões totais
                  
                  $$
                  = \sum (e)
                  $$
                - Emissões well-to-tank totais
                  
                  $$
                  = \sum (e_{wtt})
                  $$
                - Custo total
                  
                  $$
                  = \sum (c)
                  $$
                - Emissões poupadas
                  
                  $$
                  = \sum (e) - (\sum (q) \times 0.0036 \times FE_{mitigacao} \div 1000)
                  $$
                    - FE_mitigação corresponde ao FE do combustível escolhido para mitigação.
                      
                - Poupanças
                  
                  $$
                  = \sum (c)-(\sum (q) \times p_{kWh_{mitigacao}})
                  $$
                    - P_kWh_mitigação corresponde ao preço do combustível escolhido para mitigação.
                      
        - Eletricidade
          
            - Cliente
              
                - Fornecedor
                  
                    - Usar os dados de FE e de custos da eletricidade nos Edifícios.
                      
                - Motores elétricos
                  
                    - Quantidade [Q]
                      
                - Central de ar comprimido
                  
                    - Quantidade [Q]
                      
                - Evaporadores
                  
                    - Quantidade [Q]
                      
                - Outros
                  
                    - Quantidade [Q]
                      
                - Cálculos para cada fonte de emissão
                  
                    - Emissões [E]
                      
                      $$
                      = q \times FE \div 1000
                      $$
                    - Emissões well-to-tank [E_wtt]
                      
                      $$
                      = q \times FE_{wtt} \div 1000
                      $$
                    - Custo [C]
                      
                      $$
                      = q \times p
                      $$
                - Consumo total
                  
                  $$
                  = \sum (q)
                  $$
                    - Mostrar abaixo da última fonte de emissão para o utilizador poder ver o somatório dos consumos por combustível.
                      
                - Emissões totais
                  
                  $$
                  = \sum (e)
                  $$
                - Emissões well-to-tank totais
                  
                  $$
                  = \sum (e_{wtt})
                  $$
                - Custo total
                  
                  $$
                  = \sum (c)
                  $$
- Compras
  
    - Sector primário
      
        - Fertilizantes
          
            - Get2C
              
                - Tipo de fertilizante
                  
                - Fator de emissão [FE]
                  
                    - Fonte da informação
                      
                - Fator de emissão de produção [FE_producao]
                  
                    - Fonte da informação
                      
                - Novo bem ou serviço
                  
            - Cliente
              
                - Fertilizantes usados
                  
                - Quantidade [Q]
                  
                - Emissões
                  
                  $$
                  = q \times FE \div 1000
                  $$
                    - A1
                      
                - Emissões de produção
                  
                  $$
                  = q \times FE_{producao} \div 1000
                  $$
                    - A3,C1
                      
    - Bens ou serviços
      
        - Get2C
          
            - Bem ou serviço
              
            - Unidade [U]
              
                - kg
                  
                - €
                  
                - L
                  
                - Unidade
                  
            - Fator de emissão [FE]
              
                - Fonte da informação
                  
            - Novo bem ou serviço
              
        - Cliente
          
            - Bens ou serviços adquiridos
              
            - Quantidade [Q]
              
            - Emissões
              
              $$
              = q \times FE \div 1000
              $$
                - A3,C1
                  
- Resíduos
  
    - Get2C
      
        - Resíduos recicláveis
          
            - Tipo de resíduos
              
            - Densidade [D]
              
            - Fator de emissão de reciclagem (média diária) [FE_reciclagem]
              <!-- ::xmind-pos:{"x":21291,"y":829} -->
              
                - Fonte da informação
                  
            - Novo resíduo
              
        - Resíduos não reciclados
          
            - Densidade [D_NR]
              
            - Fator de emissão de aterro (média diária) [FE_aterro]
              <!-- ::xmind-pos:{"x":21939,"y":674} -->
              
                - Fonte da informação
                  
            - Fator de emissão de incineração (média diária) [FE_inceneracao]
              <!-- ::xmind-pos:{"x":21974,"y":736} -->
              
                - Fonte da informação
                  
    - Cliente
      
        - Selecione os tipos de resíduos que recicla
          
            - Sacos ou kg?
              
                - Sacos
                  
                    - Quantos sacos produz por dia?
                      
                        - Quantidade
                          
                            - x 20 L [A]
                              
                            - x 50 L [B]
                              
                            - x 100 L [C]
                              
                            - Outra
                              
                                - Capacidade [CAP]
                                  
                                - Quantidade [S]
                                  
                    - Recolha
                      
                        - Mensal
                          
                            - Emissões
                              
                              $$
                              = [( a \times 20 ) + ( b \times 50 ) + ( c \times 100 ) + ( s \times cap )] \times d \times FE_{reciclagem} \times ( \frac{da}{12} ) \div 1000
                              $$
                                - A3,C5
                                  
                        - Anual
                          
                            - Emissões
                              
                              $$
                              = [( a \times 20 ) + ( b \times 50 ) + ( c \times 100 ) + ( s \times cap )] \times d \times FE_{reciclagem} \times da \div 1000
                              $$
                                - A3,C5
                                  
                - kg
                  
                    - Quantidade [Q]
                      
                    - Recolha
                      
                        - Mensal
                          
                            - Emissões
                              
                              $$
                              = q \times FE_{reciclagem} \times ( \frac{da}{12} ) \div 1000
                              $$
                                - A3,C5
                                  
                        - Anual
                          
                            - Emissões
                              
                              $$
                              = q \times FE_{reciclagem} \times da \div 1000
                              $$
                                - A3,C5
                                  
        - Produz resíduos não reciclados?
          
            - Não
              
            - Sim
              
                - Sacos ou kg?
                  
                    - Sacos
                      
                        - Quantos sacos produz por dia?
                          
                            - Quantidade
                              
                                - x 20 L [A]
                                  
                                - x 50 L [B]
                                  
                                - x 100 L [C]
                                  
                                - Outra
                                  
                                    - Capacidade [CAP]
                                      
                                    - Quantidade [S]
                                      
                        - Recolha
                          
                            - Mensal
                              
                                - Emissões [E]
                                  
                                  $$
                                  = [( a \times 20 ) + ( b \times 50 ) + ( c \times 100 ) + ( s \times cap )] \times d_{nr} \times (\frac{FE_{aterro}+FE_{inceneracao}}{2}) \times ( \frac{da}{12} ) \div 1000
                                  $$
                                    - A3,C5
                                      
                            - Anual
                              
                                - Emissões [E]
                                  
                                  $$
                                  = [( a \times 20 ) + ( b \times 50 ) + ( c \times 100 ) + ( s \times cap )] \times d_{nr} \times (\frac{FE_{aterro}+FE_{inceneracao}}{2}) \times da \div 1000
                                  $$
                                    - A3,C5
                                      
                    - kg
                      
                        - Quantidade [Q]
                          
                        - Recolha
                          
                            - Mensal
                              
                                - Emissões [E]
                                  
                                  $$
                                  = q \times (\frac{FE_{aterro}+FE_{inceneracao}}{2}) \times ( \frac{da}{12} ) \div 1000
                                  $$
                                    - A3,C5
                                      
                            - Anual
                              
                                - Emissões [E]
                                  
                                  $$
                                  = q \times (\frac{FE_{aterro}+FE_{inceneracao}}{2}) \times da \div 1000
                                  $$
                                    - A3,C5
                                      
        - Emissões poupadas
          
          $$
          = e - (e \div (\frac{FE_{aterro}+FE_{inceneracao}}{2}) \times \overline{FE}_{reciclagem})
          $$
            - Usar a média dos FE de reciclagem.
              
- Sector primário
  
    - Pecuária
      
        - Get2C
          
            - Animal
              
            - Fator de emissão [FE]
              
                - Fonte da informação
                  
            - Novo animal
              
        - Cliente
          
            - Animais existentes
              
            - Cabeças [Q]
              
            - Recolha
              
                - Mensal
                  
                    - Emissões
                      
                      $$
                      = q \times FE \div 12 \div 1000
                      $$
                        - A1
                          
                - Anual
                  
                    - Emissões
                      
                      $$
                      = q \times FE \div 1000
                      $$
                        - A1
                          
