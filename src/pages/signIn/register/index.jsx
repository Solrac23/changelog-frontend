import Head from 'next/head'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {ibge} from '@/services/api'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import styles from '@/pages/signIn/register/styles.module.css'
import Button from '@/components/Button'

export default function Register(){
	const [ufs, setUfs] = useState([])
	const [cities, setCities] = useState([])

	const [state, setState] = useState('') // vazio por enquanto
	const { register, handleSubmit} = useForm()
	const { signUp } = useAuth()
	
	async function handleRegister(data) {
		await signUp(data)
	}

	useEffect(() => {
		async function handleStates(){
			try{
				const response = await ibge().get('/ibge/uf/v1')
				const states = response.data
				setUfs(states)
			}catch(err){
				console.error(err.message)
			}
		}

		handleStates()
	},[])

	useEffect(() => {
		async function handleCities(siglaUF){
			try{
				// eslint-disable-next-line quotes
				const response = await ibge().get(`/ibge/municipios/v1/${siglaUF}?providers=dados-abertos-br,gov,wikipedia`)
				const cities = response.data

				setCities(cities)
			}catch(err){
				console.error(err.message)
			}
		}

		handleCities(state)
	}, [state])

	return(
		<>
			<Head>
				<title>Cadastro</title>
				<meta name="description" content="Site para versionamento de códigos" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.container}>
				<form onSubmit={handleSubmit(handleRegister)}>
					<fieldset id={styles.signUp}>
						<legend>Cadastro</legend>
						<div className={styles.fullName}>
							<div className={styles.formGroup}>
								<label htmlFor="first_name">Nome</label>
								<input
									{...register('first_name')} 
									type="text" 
									name="first_name" 
									id={styles.first_name} 
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="last_name">Sobrenome</label>
								<input
									{...register('last_name')} 
									type="text" 
									name="last_name" 
									id={styles.last_name} 
								/>
							</div>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="username">Username</label>
							<input
								{...register('username')} 
								type="text" 
								name="username" 
								id="username" 
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="email">E-mail</label>
							<input
								{...register('email')} 
								type="email" 
								name="email" 
								id="email" 
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="password">Password</label>
							<input
								{...register('password')} 
								type="password" 
								name="password" 
								id="password" 
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="CompanyName">Nome da Empresa</label>
							<input
								{...register('CompanyName')}	 
								type="text" 
								name="CompanyName" 
								id="CompanyName" 
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="uf">Uf</label>
							<select
								{...register( 'uf', { required: true } )}
								onChange={(e) => setState(e.target.value)}
								name="uf"
								id={styles.uf}
							>
								{ufs.map((state) => {
									return (
										<option 
											key={state.id} 
											value={state.sigla}
										>
											{state.sigla}
										</option>
									)
								})}
							</select>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="city">Cidade</label>
							<select
								{...register( 'city', { required: true } )} 
								name="city" 
								id={styles.city}
							>
								{cities.map((city, index) => {
									return(
										<option key={index} value={city.nome}>{city.nome}</option>
									)
								})}
							</select>
						</div>
						<Button typeBtn={'submit'} text={'Salvar'} />
						<div className={styles.link}>
							<span>Já tem uma conta?</span>
							<Link href='/signIn/auth/' className={styles.backButton}>Login</Link>
						</div>
					</fieldset>
				</form>
			</main>
		</>
	)
}